&apos;use client&apos;;

import Link from &apos;next/link&apos;;
import { useState, useEffect } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Menu, X, User, LogOut, ShoppingCart } from &apos;lucide-react&apos;;
import { supabase } from '@/lib/supabase&apos;;
import { signOut } from '@/lib/auth&apos;;
import { useRouter } from &apos;next/navigation&apos;;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier l&apos;utilisateur actuel
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Écouter les changements d&apos;authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-heading font-bold text-gradient"
            >
              Aumarché
            </motion.div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-neutral-700 hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link href="/produits" className="text-neutral-700 hover:text-primary transition-colors">
              Produits
            </Link>
            <Link href="/parrainage" className="text-neutral-700 hover:text-primary transition-colors">
              Parrainage
            </Link>
            {user && (
              <Link href="/dashboard" className="text-neutral-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-neutral-700 hover:text-primary">
                  <User size={20} />
                  <span>Mon compte</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-neutral-700 hover:text-secondary"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-outline">
                  Connexion
                </Link>
                <Link href="/signup" className="btn-primary">
                  S&apos;inscrire
                </Link>
              </div>
            )}
            <button className="btn-secondary flex items-center space-x-2">
              <ShoppingCart size={20} />
              <span>Commander</span>
            </button>
          </div>

          {/* Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile Ouvert */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: &apos;auto&apos; }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-neutral-700 hover:text-primary">
                Accueil
              </Link>
              <Link href="/produits" className="text-neutral-700 hover:text-primary">
                Produits
              </Link>
              <Link href="/parrainage" className="text-neutral-700 hover:text-primary">
                Parrainage
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-neutral-700 hover:text-primary">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-neutral-700 hover:text-secondary"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-neutral-700 hover:text-primary">
                    Connexion
                  </Link>
                  <Link href="/signup" className="text-neutral-700 hover:text-primary">
                    S&apos;inscrire
                  </Link>
                </>
              )}
              <button className="btn-secondary w-full">
                Commander maintenant
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}