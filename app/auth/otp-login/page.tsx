'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';

const RESEND_COOLDOWN = 60; // secondes avant de pouvoir renvoyer

export default function OTPLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input-phone' | 'input-otp'>('input-phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parrainInfo, setParrainInfo] = useState<{ nom?: string; avatar_url?: string } | null>(null);
  const [parrainCode, setParrainCode] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Récupérer code parrainage dans l'URL si présent
    const refCode = searchParams.get('ref');
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
        .from('users')
        .select('nom, avatar_url')
        .eq('code_parrainage', code)
        .single();

      if (error) {
        console.warn('Erreur fetch parrain:', error.message);
        return;
      }

      setParrainInfo(data);
    } catch (e) {
      console.error('Erreur fetch parrain', e);
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
      setError('Numéro de téléphone invalide.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Quota d\'envoi dépassé. Réessayez demain.');
        } else {
          setError(data.error || 'Erreur lors de l\'envoi du code OTP.');
        }
        setLoading(false);
        return;
      }

      setStep('input-otp');
      startCooldown();
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    if (!canResend) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Quota d\'envoi dépassé. Réessayez demain.');
        } else {
          setError(data.error || 'Erreur lors de l\'envoi du code OTP.');
        }
        setLoading(false);
        return;
      }

      startCooldown();
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('Le code OTP doit contenir 6 chiffres.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Code OTP invalide ou expiré.');
        setLoading(false);
        return;
      }

      // Connexion réussie, redirection
      router.push('/dashboard');
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
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
            ← Retour à l'accueil
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
                <p className="text-sm text-neutral-600">Vous bénéficiez d'avantages exclusifs grâce à ce parrainage.</p>
              </div>
            </div>
          )}
        </div>

        {step === 'input-phone' && (
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
              {loading ? 'Envoi du code...' : 'Recevoir le code SMS'}
            </button>
          </form>
        )}

        {step === 'input-otp' && (
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
              {loading ? 'Vérification...' : 'Valider le code'}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || !canResend}
              className={`w-full mt-2 btn-secondary disabled:opacity-50`}
            >
              {canResend ? 'Renvoyer le code' : `Renvoyer dans ${countdown}s`}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
