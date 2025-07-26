import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    if (!phone || typeof phone !== 'string' || !phone.match(/^\+?\d{8,15}$/)) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }
    if (!code || typeof code !== 'string' || code.length !== 6 || !code.match(/^\d{6}$/)) {
      return NextResponse.json({ error: 'Code OTP invalide' }, { status: 400 });
    }

    const supabase = createClient();

    // Vérifier OTP dans la base (non expiré et non vérifié)
    const { data: otpSession, error: selectError } = await supabase
      .from('otp_sessions')
      .select('*')
      .eq('phone_number', phone)
      .eq('otp_code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (selectError || !otpSession) {
      return NextResponse.json({ error: 'OTP invalide ou expiré' }, { status: 400 });
    }

    // Marquer la session OTP comme vérifiée
    const { error: updateError } = await supabase
      .from('otp_sessions')
      .update({ verified: true })
      .eq('id', otpSession.id);

    if (updateError) {
      console.error('Erreur mise à jour OTP vérifié:', updateError);
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }

    // Authentifier l'utilisateur via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });

    if (authError) {
      console.error('Erreur vérification OTP Supabase Auth:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'OTP vérifié', session: authData.session });
  } catch (err) {
    console.error('Erreur serveur verify-otp:', err);
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
  }
}
