&apos;use client&apos;;

import { useState, useEffect } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useRouter } from &apos;next/navigation&apos;;
import { 
  Users, 
  Gift, 
  TrendingUp, 
  Share2, 
  Copy, 
  Crown,
  Star,
  Calendar,
  DollarSign
} from &apos;lucide-react&apos;;
import Header from '@/components/layout/header&apos;;
import Footer from '@/components/layout/footer&apos;;
import { supabase } from '@/lib/supabase&apos;;
import { getCurrentUser } from '@/lib/auth&apos;;
import { generateReferralUrl } from '@/lib/referral-utils&apos;;

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    filleuls: 0,
    niveau: 1,
    totalRecompenses: 0,
    commandesTotal: 0,
  });
  const [filleuls, setFilleuls] = useState<any[]>([]);
  const [recompenses, setRecompenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login&apos;);
        return;
      }

      // Récupérer les données utilisateur
      const { data: userData } = await supabase
        .from(&apos;users&apos;)
        .select('*')
        .eq(&apos;id&apos;, currentUser.id)
        .single();

      if (userData) {
        setUser(userData);
        setReferralLink(generateReferralUrl(userData.code_parrainage));
      }

      // Récupérer les statistiques
      const { data: parrainages } = await supabase
        .from(&apos;parrainages&apos;)
        .select('*, filleul:users(*)')
        .eq(&apos;parrain_id&apos;, currentUser.id);

      const { data: commandes } = await supabase
        .from(&apos;commandes&apos;)
        .select(&apos;montant&apos;)
        .eq(&apos;user_id&apos;, currentUser.id);

      const { data: recompensesData } = await supabase
        .from(&apos;recompenses&apos;)
        .select('*')
        .eq(&apos;user_id&apos;, currentUser.id)
        .order(&apos;date&apos;, { ascending: false });

      setFilleuls(parrainages || []);
      setRecompenses(recompensesData || []);
      setStats({
        filleuls: parrainages?.length || 0,
        niveau: Math.floor((parrainages?.length || 0) / 3) + 1,
        totalRecompenses: recompensesData?.length || 0,
        commandesTotal: commandes?.reduce((sum, cmd) => sum + cmd.montant, 0) || 0,
      });

    } catch (error) {
      console.error(&apos;Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {/* En-tête Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold text-neutral-800 mb-2">
              Bonjour {user?.nom} ! 👋
            </h1>
            <p className="text-neutral-600">
              Gérez votre réseau de parrainage et suivez vos récompenses
            </p>
          </motion.div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Filleuls</p>
                  <p className="text-2xl font-bold text-primary">{stats.filleuls}</p>
                </div>
                <Users className="text-primary" size={32} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Niveau</p>
                  <p className="text-2xl font-bold text-secondary">{stats.niveau}</p>
                </div>
                <Crown className="text-secondary" size={32} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Récompenses</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalRecompenses}</p>
                </div>
                <Gift className="text-primary" size={32} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Commandes</p>
                  <p className="text-2xl font-bold text-secondary">
                    {stats.commandesTotal.toLocaleString()} F
                  </p>
                </div>
                <DollarSign className="text-secondary" size={32} />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lien de parrainage */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Share2 className="mr-2 text-primary" />
                Votre lien de parrainage
              </h2>
              
              <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-neutral-600 mb-2">Code: {user?.code_parrainage}</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-white border border-neutral-300 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="btn-primary px-3 py-2 text-sm"
                  >
                    {copied ? '✓' : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <p className="text-sm text-neutral-600">
                Partagez ce lien avec vos proches pour gagner des récompenses !
              </p>
            </motion.div>

            {/* Progression */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-primary" />
                Progression vers le niveau {stats.niveau + 1}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Filleuls actuels</span>
                    <span>{stats.filleuls}/3</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.filleuls % 3) / 3 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-neutral-600">
                  Plus que {3 - (stats.filleuls % 3)} filleuls pour débloquer de nouvelles récompenses !
                </p>
              </div>
            </motion.div>
          </div>

          {/* Liste des filleuls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card-shadow p-6 mt-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-primary" />
              Mes filleuls ({filleuls.length})
            </h2>

            {filleuls.length > 0 ? (
              <div className="space-y-4">
                {filleuls.map((parrainage, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {parrainage.filleul?.nom?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{parrainage.filleul?.nom}</p>
                        <p className="text-sm text-neutral-600">
                          Inscrit le {new Date(parrainage.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="text-yellow-500" size={16} />
                      <span className="text-sm font-medium text-primary">Actif</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto text-neutral-400 mb-4" size={48} />
                <p className="text-neutral-600">
                  Vous n&apos;avez pas encore de filleuls. Partagez votre lien pour commencer !
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}