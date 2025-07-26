'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const sId = searchParams.get('sessionId') || '';
    const ph = searchParams.get('phone') || '';
    setSessionId(sId);
    setPhone(ph);

    // Compte à rebours
    setCountdown(60);
    setCanResend(false);
  }, [searchParams]);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        body: JSON.stringify({ action: 'verify', otp, sessionId }),
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Erreur vérification OTP');

      // Redirection sécurisée, par exemple vers dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    setCountdown(60);
    setCanResend(false);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        body: JSON.stringify({ action: 'send', phone }),
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur renvoi OTP');
      setSessionId(json.sessionId);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Vérification du code OTP</h2>
      <p className="mb-6 text-center">Code envoyé au numéro : <strong>{phone}</strong></p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-md">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Entrez le code à 6 chiffres"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-xl tracking-widest"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Vérification...' : 'Valider le code'}
        </button>
      </form>

      <div className="mt-6 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-primary underline font-semibold"
          >
            Renvoyer le code
          </button>
        ) : (
          <p>Renvoyer le code dans {countdown}s</p>
        )}
      </div>
    </div>
  );
}
