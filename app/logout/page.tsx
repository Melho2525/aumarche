'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import Loading from '@/components/ui/loading';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.push('/');
    };

    handleLogout();
  }, [router]);

  return <Loading />;
}