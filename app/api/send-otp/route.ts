import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (!phone || typeof phone !== 'string' || !phone.match(/^\+?\d{8,15}$/)) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    const supabase = createClient();

    // Générer un OTP 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer une session OTP dans la base
    const { error: rpcError } = await supabase.rpc('create_otp_session', {
      p_phone: phone,
      p_otp: otp,
      p_ip: ip,
    });

    if (rpcError) {
      console.error('Erreur RPC create_otp_session:', rpcError);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    // Envoyer le code OTP via Supabase Auth
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' }
    });

    if (authError) {
      console.error('Erreur envoi OTP via Supabase Auth:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP envoyé' });
  } catch (err) {
    console.error('Erreur serveur send-otp:', err);
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
  }
}
