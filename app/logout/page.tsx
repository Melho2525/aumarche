&apos;use client&apos;;

import { useEffect } from &apos;react&apos;;
import { useRouter } from &apos;next/navigation&apos;;
import { signOut } from '@/lib/auth&apos;;
import Loading from '@/components/ui/loading&apos;;

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