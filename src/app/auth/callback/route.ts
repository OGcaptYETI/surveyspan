import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange code for session
    const { data: { session }, error: sessionError } = 
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Unable to verify email`);
    }

    if (session?.user) {
      // Check if user record already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 means "not found", other errors are actual problems
        console.error('Error checking for existing user:', fetchError);
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Unable to verify user profile`);
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              role: 'user',
              created_at: new Date().toISOString(),
              email_verified: true,
              status: 'active'
            }
          ]);

        if (userError) {
          console.error('User creation error:', userError);
          return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Unable to create user profile`);
        }
      } else {
        // Update existing user's verification status
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email_verified: true,
            status: 'active'
          })
          .eq('id', session.user.id);
          
        if (updateError) {
          console.error('User update error:', updateError);
        }
      }
    }
  }

  // Redirect to dashboard after successful verification and user creation
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}