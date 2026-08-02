import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'File path parameter is required.' }, { status: 400 });
    }

    // Verify Admin Bearer authorization token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing session token.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // Initialize admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
      realtime: { transport: null }
    });

    // Verify user identity from session token
    const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session.' }, { status: 401 });
    }

    // Check if user is an authorized admin by email or role
    const userEmail = (user.email || '').toLowerCase();
    const isAdminEmail = adminEmails.includes(userEmail);

    let isAdminRole = false;
    if (!isAdminEmail) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile && profile.role === 'admin') {
        isAdminRole = true;
      }
    }

    if (!isAdminEmail && !isAdminRole) {
      return NextResponse.json({ error: 'Forbidden: Admin privileges required.' }, { status: 403 });
    }

    // Generate 1-hour secure signed URL using admin service role key
    const { data: signedData, error: signedErr } = await supabaseAdmin.storage
      .from('agent-documents')
      .createSignedUrl(filePath, 3600); // 3600 seconds = 1 hour

    if (signedErr || !signedData?.signedUrl) {
      console.error('Error generating signed URL:', signedErr);
      return NextResponse.json({ error: 'Document file not found in storage.' }, { status: 404 });
    }

    return NextResponse.json({ signedUrl: signedData.signedUrl }, { status: 200 });
  } catch (err) {
    console.error('Admin document URL API error:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}
