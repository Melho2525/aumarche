&apos;use client&apos;;

import { useState, useEffect } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useRouter } from &apos;next/navigation&apos;;
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Activity,
  Calendar,
  DollarSign
} from &apos;lucide-react&apos;;
import Header from '@/components/layout/header&apos;;
import Footer from '@/components/layout/footer&apos;;
import { supabase } from '@/lib/supabase&apos;;
import { getCurrentUser, isAdmin } from '@/lib/auth&apos;;

export default function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalParrainages: 0,
    totalCommandes: 0,
    chiffreAffaires: 0,
    nouveauxUtilisateurs: 0,
    tauxConversion: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentCommandes, setRecentCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login&apos;);
        return;
      }

const adminCheck = await isAdmin(); // ✅
      if (!adminCheck) {
        router.push('/dashboard&apos;);
        return;
      }

      await loadAdminData();
    } catch (error) {
      console.error(&apos;Erreur admin:', error);
      router.push('/');
    }
  };

  const loadAdminData = async () => {
    try {
      // Statistiques générales
      const { data: users } = await supabase
        .from(&apos;users&apos;)
        .select(&apos;id, created_at&apos;);

      const { data: parrainages } = await supabase
        .from(&apos;parrainages&apos;)
        .select(&apos;id&apos;);

      const { data: commandes } = await supabase
        .from(&apos;commandes&apos;)
        .select(&apos;id, montant, created_at&apos;);

      // Utilisateurs récents
      const { data: recentUsersData } = await supabase
        .from(&apos;users&apos;)
        .select(&apos;nom, email, created_at&apos;)
        .order(&apos;created_at&apos;, { ascending: false })
        .limit(5);

      // Commandes récentes
      const { data: recentCommandesData } = await supabase
        .from(&apos;commandes&apos;)
        .select(&apos;id, montant, created_at, user:users(nom)')
        .order(&apos;created_at&apos;, { ascending: false })
        .limit(5);

      const totalUsers = users?.length || 0;
      const totalParrainages = parrainages?.length || 0;
      const totalCommandes = commandes?.length || 0;
      const chiffreAffaires = commandes?.reduce((sum, cmd) => sum + cmd.montant, 0) || 0;

      // Nouveaux utilisateurs cette semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const nouveauxUtilisateurs = users?.filter(u => 
        new Date(u.created_at) > weekAgo
      ).length || 0;

      setStats({
        totalUsers,
        totalParrainages,
        totalCommandes,
        chiffreAffaires,
        nouveauxUtilisateurs,
        tauxConversion: totalUsers > 0 ? (totalCommandes / totalUsers * 100) : 0,
      });

      setRecentUsers(recentUsersData || []);
      setRecentCommandes(recentCommandesData || []);

    } catch (error) {
      console.error(&apos;Erreur lors du chargement des données admin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold text-neutral-800 mb-2">
              Tableau de bord Admin
            </h1>
            <p className="text-neutral-600">
              Vue d&apos;ensemble des statistiques de la plateforme Aumarché
            </p>
          </motion.div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card-shadow p-6 gradient-primary text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Utilisateurs</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs opacity-75">+{stats.nouveauxUtilisateurs} cette semaine</p>
                </div>
                <Users size={40} className="opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Parrainages</p>
                  <p className="text-3xl font-bold text-secondary">{stats.totalParrainages}</p>
                  <p className="text-xs text-neutral-500">Total actifs</p>
                </div>
                <TrendingUp size={40} className="text-secondary opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Commandes</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalCommandes}</p>
                  <p className="text-xs text-neutral-500">
                    {stats.tauxConversion.toFixed(1)}% conversion
                  </p>
                </div>
                <ShoppingCart size={40} className="text-primary opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="card-shadow p-6 md:col-span-2 lg:col-span-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Chiffre d&apos;affaires</p>
                  <p className="text-4xl font-bold text-gradient">
                    {stats.chiffreAffaires.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-neutral-500">Total des ventes</p>
                </div>
                <DollarSign size={48} className="text-primary opacity-80" />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Utilisateurs récents */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2 text-primary" />
                Utilisateurs récents
              </h2>

              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.nom}</p>
                      <p className="text-sm text-neutral-600">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Commandes récentes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingCart className="mr-2 text-primary" />
                Commandes récentes
              </h2>

              <div className="space-y-4">
                {recentCommandes.map((commande, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">#{commande.id.slice(0, 8)}</p>
                      <p className="text-sm text-neutral-600">
                        {commande.user?.nom || &apos;Client&apos;}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {commande.montant.toLocaleString()} F
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(commande.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
