import { NextResponse } from 'next/server';
import https from 'https';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Helper function to fetch JSON from user_json_url using https.get
function fetchPhoneEmailJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (err) {
            reject(new Error('Invalid JSON received from phone.email'));
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_json_url, role = 'user', name = '', referred_by = '' } = body;

    if (!user_json_url) {
      return NextResponse.json({ error: 'Missing user_json_url parameter' }, { status: 400 });
    }

    // Security: Validate that user_json_url is hosted on phone.email
    let parsedUrl;
    try {
      parsedUrl = new URL(user_json_url);
    } catch {
      return NextResponse.json({ error: 'Invalid user_json_url format' }, { status: 400 });
    }

    const isPhoneEmailDomain =
      parsedUrl.hostname === 'phone.email' || parsedUrl.hostname.endsWith('.phone.email');
    if (!isPhoneEmailDomain) {
      return NextResponse.json({ error: 'Untrusted user_json_url domain' }, { status: 403 });
    }

    // Fetch verified user details from phone.email via https.get
    const jsonData = await fetchPhoneEmailJson(user_json_url);

    const user_country_code = String(jsonData.user_country_code || '91').replace(/\D/g, '');
    const user_phone_number = String(jsonData.user_phone_number || '').replace(/\D/g, '');
    const user_first_name = jsonData.user_first_name || '';
    const user_last_name = jsonData.user_last_name || '';

    if (!user_phone_number) {
      return NextResponse.json({ error: 'Unable to retrieve verified phone number from phone.email' }, { status: 400 });
    }

    // Determine normalized 10-digit mobile number and full international mobile number
    const normalizedMobile10 = user_phone_number.slice(-10);
    const fullIntlPhone = `+${user_country_code}${user_phone_number}`;

    // Determine full name
    const computedName =
      (name && name.trim()) ||
      [user_first_name, user_last_name].filter(Boolean).join(' ') ||
      `User ${normalizedMobile10.slice(-4)}`;

    // Validate role against allowlist
    const validRole = role === 'agent' ? 'agent' : 'user';

    // Initialize Supabase Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Supabase Service Role is not configured.');
      return NextResponse.json({ error: 'Server authentication misconfiguration' }, { status: 500 });
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Check if a profile or user already exists with this mobile number
    const { data: existingProfiles, error: checkError } = await adminSupabase
      .from('profiles')
      .select('id, phone, email, role')
      .or(`phone.eq.${normalizedMobile10},phone.eq.${fullIntlPhone}`)
      .limit(1);

    if (checkError) {
      console.warn('Profile lookup error:', checkError.message);
    }

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json(
        {
          error: 'An account with this mobile number is already registered. Please log in.',
          alreadyRegistered: true,
        },
        { status: 400 }
      );
    }

    // Generate secure password for phone.email user authentication in Supabase
    const securePassword = `${crypto.randomBytes(16).toString('hex')}H2H!9`;
    const emailForPhoneUser = `${normalizedMobile10}@phone.email`;

    // Create user in Supabase Auth via Admin API
    const { data: createData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: emailForPhoneUser,
      password: securePassword,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: computedName,
        role: validRole,
        phone: normalizedMobile10,
        referred_by: validRole === 'agent' ? (referred_by?.trim() || null) : null,
      },
    });

    if (createError) {
      // If user with this email already exists in auth.users
      if (createError.message.includes('already registered') || createError.message.includes('already exists')) {
        return NextResponse.json(
          {
            error: 'An account with this mobile number is already registered. Please log in.',
            alreadyRegistered: true,
          },
          { status: 400 }
        );
      }
      console.error('Supabase createUser error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    const newUserId = createData.user.id;

    // Ensure public.profiles record is accurately set
    const { error: profileUpsertError } = await adminSupabase.from('profiles').upsert(
      {
        id: newUserId,
        full_name: computedName,
        email: emailForPhoneUser,
        phone: normalizedMobile10,
        role: validRole,
        agent_code: validRole === 'agent' ? `H2H-${Math.floor(10000 + Math.random() * 90000)}` : null,
        referred_by: validRole === 'agent' ? (referred_by?.trim() || null) : null,
        approved: validRole === 'agent' ? false : true,
      },
      { onConflict: 'id' }
    );

    if (profileUpsertError) {
      console.warn('Profile upsert warning:', profileUpsertError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully via Mobile OTP',
      user: {
        id: newUserId,
        email: emailForPhoneUser,
        password: securePassword,
        phone: normalizedMobile10,
        role: validRole,
        approved: validRole === 'agent' ? false : true,
        full_name: computedName,
      },
    });
  } catch (err) {
    console.error('phone-email-verify error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
