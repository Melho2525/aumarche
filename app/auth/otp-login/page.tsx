&apos;use client&apos;;

import { useState, useEffect, useRef } from &apos;react&apos;;
import { useRouter, useSearchParams } from &apos;next/navigation&apos;;
import { supabase } from '@/lib/supabase&apos;;
import { motion } from &apos;framer-motion&apos;;
import Link from &apos;next/link&apos;;

const RESEND_COOLDOWN = 60; // secondes avant de pouvoir renvoyer

export default function OTPLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<&apos;input-phone&apos; | &apos;input-otp&apos;>(&apos;input-phone&apos;);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parrainInfo, setParrainInfo] = useState<{ nom?: string; avatar_url?: string } | null>(null);
  const [parrainCode, setParrainCode] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Récupérer code parrainage dans l&apos;URL si présent
    const refCode = searchParams.get(&apos;ref&apos;);
    if (refCode) {
      setParrainCode(refCode);
      fetchParrainInfo(refCode);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [searchParams]);

  async function fetchParrainInfo(code: string) {
    try {
      const { data, error } = await supabase
        .from(&apos;users&apos;)
        .select(&apos;nom, avatar_url&apos;)
        .eq(&apos;code_parrainage&apos;, code)
        .single();

      if (error) {
        console.warn(&apos;Erreur fetch parrain:', error.message);
        return;
      }

      setParrainInfo(data);
    } catch (e) {
      console.error(&apos;Erreur fetch parrain&apos;, e);
    }
  }

  function startCooldown() {
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!phone.match(/^\+?\d{8,15}$/)) {
      setError(&apos;Numéro de téléphone invalide.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/send-otp&apos;, {
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(&apos;Quota d\&apos;envoi dépassé. Réessayez demain.');
        } else {
          setError(data.error || &apos;Erreur lors de l\&apos;envoi du code OTP.');
        }
        setLoading(false);
        return;
      }

      setStep(&apos;input-otp&apos;);
      startCooldown();
    } catch {
      setError(&apos;Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    if (!canResend) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/send-otp&apos;, {
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(&apos;Quota d\&apos;envoi dépassé. Réessayez demain.');
        } else {
          setError(data.error || &apos;Erreur lors de l\&apos;envoi du code OTP.');
        }
        setLoading(false);
        return;
      }

      startCooldown();
    } catch {
      setError(&apos;Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError(&apos;Le code OTP doit contenir 6 chiffres.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/verify-otp&apos;, {
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || &apos;Code OTP invalide ou expiré.');
        setLoading(false);
        return;
      }

      // Connexion réussie, redirection
      router.push('/dashboard&apos;);
    } catch {
      setError(&apos;Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary mb-6">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Connexion par <span className="text-gradient">Téléphone & OTP</span>
          </h1>
          <p className="text-neutral-600 mb-4">Accédez à votre compte via SMS</p>

          {parrainInfo && (
            <div className="flex items-center justify-center space-x-4 bg-primary-50 p-4 rounded-md border border-primary-200 mb-6">
              {parrainInfo.avatar_url ? (
                <img
                  src={parrainInfo.avatar_url}
                  alt="Avatar Parrain"
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {parrainInfo.nom?.[0].toUpperCase() || '?'}
                </div>
              )}
              <div>
                <p className="font-semibold text-primary">Parrain : {parrainInfo.nom}</p>
                <p className="text-sm text-neutral-600">Vous bénéficiez d&apos;avantages exclusifs grâce à ce parrainage.</p>
              </div>
            </div>
          )}
        </div>

        {step === &apos;input-phone&apos; && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 07 00 00 00 00"
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? &apos;Envoi du code...' : &apos;Recevoir le code SMS&apos;}
            </button>
          </form>
        )}

        {step === &apos;input-otp&apos; && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Code OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? &apos;Vérification...' : &apos;Valider le code&apos;}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || !canResend}
              className={`w-full mt-2 btn-secondary disabled:opacity-50`}
            >
              {canResend ? &apos;Renvoyer le code&apos; : `Renvoyer dans ${countdown}s`}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
