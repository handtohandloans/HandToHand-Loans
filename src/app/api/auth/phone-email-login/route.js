import { NextResponse } from 'next/server';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

// Helper function to fetch JSON from user_json_url using https.get
function fetchPhoneEmailJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

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
    const { user_json_url } = body;

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

    if (!user_phone_number) {
      return NextResponse.json(
        { error: 'Unable to retrieve verified phone number from phone.email' },
        { status: 400 }
      );
    }

    // Determine normalized 10-digit mobile number and full international mobile number
    const normalizedMobile10 = user_phone_number.slice(-10);
    const fullIntlPhone = `+${user_country_code}${user_phone_number}`;

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

    // Look up profile by mobile number
    const { data: profiles, error: profileLookupError } = await adminSupabase
      .from('profiles')
      .select('id, email, phone, role, approved, profile_update_message, full_name')
      .or(`phone.eq.${normalizedMobile10},phone.eq.${fullIntlPhone}`)
      .limit(1);

    if (profileLookupError) {
      console.error('Profile lookup error:', profileLookupError);
      return NextResponse.json({ error: 'Failed to look up user account.' }, { status: 500 });
    }

    // Since mobile OTP is ONLY FOR LOGIN, reject if no account exists!
    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        {
          error: `No registered account found with mobile number +91 ${normalizedMobile10}. Mobile OTP is only for login. Please sign up first.`,
          notFound: true,
          phone: normalizedMobile10,
        },
        { status: 404 }
      );
    }

    const userProfile = profiles[0];

    // Check agent approval status
    if (userProfile.role === 'agent' && !userProfile.approved) {
      const isRejected = userProfile.profile_update_message?.startsWith('REJECTED:');
      if (isRejected) {
        const reason = userProfile.profile_update_message.replace('REJECTED:', '').trim();
        return NextResponse.json(
          {
            error: `Your agent registration request has been rejected by the admin. Reason: ${reason}`,
            pendingApproval: true,
          },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          {
            error: 'Your agent account is pending approval by the admin. Contact this number (+91 8171261318) for approval of your agent id.',
            pendingApproval: true,
          },
          { status: 403 }
        );
      }
    }

    // Generate secure login link for the verified user's email
    if (!userProfile.email) {
      return NextResponse.json(
        { error: 'User profile does not have an associated email address for session generation.' },
        { status: 500 }
      );
    }

    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userProfile.email,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('generateLink error:', linkError);
      return NextResponse.json(
        { error: 'Failed to generate authentication session. Please try logging in with password.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token_hash: linkData.properties.hashed_token,
      email: userProfile.email,
      phone: normalizedMobile10,
      fullName: userProfile.full_name,
      role: userProfile.role,
    });
  } catch (err) {
    console.error('phone-email-login error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
