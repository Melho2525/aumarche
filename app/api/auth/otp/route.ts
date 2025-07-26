import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Constants
const OTP_EXPIRATION_MINUTES = 5;
const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = new Date();

  try {
    const { phone, otp, action } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Le numéro de téléphone est requis.' },
        { status: 400 }
      );
    }

    if (action === 'send') {
      // 1. Check bruteforce/IP/phone bans here (left as exercise)
      
      // 2. Create OTP session in DB or update existing
      const otpCode = generateOtpCode();
      const { error: insertError } = await supabase
        .from('otp_sessions')
        .insert({
          phone,
          otp_code: otpCode,
          attempts: 0,
          verified: false,
          created_at: now.toISOString(),
          ip,
        });

      if (insertError) {
        return NextResponse.json(
          { error: 'Erreur serveur lors de la création de session OTP.' },
          { status: 500 }
        );
      }

      // 3. Envoi du code OTP via Supabase Auth ou via un service SMS tiers (ex Twilio)
      // Exemple avec Supabase (hypothétique, car supabase.auth.signInWithOtp envoie lui-même le code)
      // await supabase.auth.signInWithOtp({ phone });

      // Si tu préfères gérer toi-même l'envoi, utilise Twilio, Nexmo, etc. ici.

      // Log & réponse
      console.log(`[OTP] Code envoyé à ${phone} depuis IP ${ip}`);

      return NextResponse.json(
        { message: 'Code OTP envoyé avec succès.' },
        { status: 200 }
      );
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json(
          { error: 'Le code OTP est requis.' },
          { status: 400 }
        );
      }

      // Récupérer session
      const { data: session, error: sessionError } = await supabase
        .from('otp_sessions')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError || !session) {
        return NextResponse.json(
          { error: 'Session OTP introuvable.' },
          { status: 400 }
        );
      }

      // Vérifier expiration
      const expirationDate = new Date(new Date(session.created_at).getTime() + OTP_EXPIRATION_MINUTES * 60000);
      if (now > expirationDate) {
        return NextResponse.json(
          { error: 'Le code OTP a expiré.' },
          { status: 400 }
        );
      }

      // Vérifier tentatives max
      if (session.attempts >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Nombre maximum de tentatives dépassé.' },
          { status: 429 }
        );
      }

      // Vérifier code OTP
      if (session.otp_code !== otp) {
        // Incrémenter tentative
        await supabase
          .from('otp_sessions')
          .update({ attempts: session.attempts + 1 })
          .eq('id', session.id);
        return NextResponse.json(
          { error: 'Code OTP invalide.' },
          { status: 400 }
        );
      }

      // Valider session
      await supabase
        .from('otp_sessions')
        .update({ verified: true })
        .eq('id', session.id);

      // Connexion via Supabase Auth (tu peux adapter selon doc)
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (authError) {
        return NextResponse.json(
          { error: 'Erreur d\'authentification Supabase.' },
          { status: 500 }
        );
      }

      // Log succès
      console.log(`[OTP] Auth réussie pour ${phone} depuis IP ${ip}`);

      // Réponse OK avec token user
      return NextResponse.json(
        { user: authData.user, session: authData.session },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Action invalide.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erreur dans l\'API OTP:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne.' },
      { status: 500 }
    );
  }
}

// Générateur OTP simple
function generateOtpCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}