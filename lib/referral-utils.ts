// Utilitaires pour le système de parrainage

export function generateUniqueReferralCode(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .substring(0, 3)
    .padEnd(3, 'x');
  
  const timestamp = Date.now().toString(36).slice(-4);
  const random = Math.random().toString(36).substring(2, 4);
  
  return `${cleanName}${timestamp}${random}`.toUpperCase();
}

export function generateReferralUrl(code: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/signup?ref=${code}`;
}

export function validateReferralCode(code: string): boolean {
  // Format: 3 lettres + 4 caractères timestamp + 2 caractères aléatoires
  const codeRegex = /^[A-Z]{3}[A-Z0-9]{6}$/;
  return codeRegex.test(code);
}

export function calculateRewardLevel(filleulsCount: number): {
  niveau: number;
  bonus: number;
  nextLevelAt: number;
  progress: number;
} {
  const niveaux = [
    { min: 0, max: 2, bonus: 0 },
    { min: 3, max: 9, bonus: 5 },
    { min: 10, max: 19, bonus: 10 },
    { min: 20, max: 49, bonus: 15 },
    { min: 50, max: Infinity, bonus: 20 },
  ];

  const niveau = niveaux.findIndex(n => filleulsCount >= n.min && filleulsCount <= n.max) + 1;
  const currentLevel = niveaux[niveau - 1];
  const nextLevel = niveaux[niveau] || niveaux[niveaux.length - 1];
  
  const progress = nextLevel.min === Infinity 
    ? 100 
    : ((filleulsCount - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100;

  return {
    niveau,
    bonus: currentLevel.bonus,
    nextLevelAt: nextLevel.min === Infinity ? filleulsCount : nextLevel.min,
    progress: Math.min(progress, 100),
  };
}

export interface ReferralReward {
  type: 'cashback' | 'discount' | 'free_delivery' | 'premium_access';
  value: number;
  description: string;
  conditions?: string;
}

export function getAvailableRewards(niveau: number): ReferralReward[] {
  const allRewards: Record<number, ReferralReward[]> = {
    1: [
      {
        type: 'discount',
        value: 5,
        description: '5% de réduction sur votre prochaine commande',
        conditions: 'Valable 30 jours',
      },
    ],
    2: [
      {
        type: 'cashback',
        value: 10,
        description: '10% de cashback sur toutes vos commandes',
        conditions: 'Cumulable avec autres offres',
      },
      {
        type: 'free_delivery',
        value: 1,
        description: 'Livraison gratuite à vie',
      },
    ],
    3: [
      {
        type: 'premium_access',
        value: 1,
        description: 'Accès prioritaire aux nouveaux produits',
      },
      {
        type: 'cashback',
        value: 15,
        description: '15% de cashback permanent',
        conditions: 'Sur toutes les commandes',
      },
    ],
    4: [
      {
        type: 'cashback',
        value: 20,
        description: '20% de cashback VIP',
        conditions: 'Niveau maximum atteint',
      },
    ],
  };

  return allRewards[niveau] || [];
}

export function formatReferralStats(stats: {
  totalFilleuls: number;
  activeFilleuls: number;
  totalEarnings: number;
  currentMonth: number;
}): string {
  return `🎯 ${stats.totalFilleuls} filleuls (${stats.activeFilleuls} actifs)
💰 ${stats.totalEarnings.toLocaleString()} F gagnés
📈 ${stats.currentMonth.toLocaleString()} F ce mois`;
}

// Vérifier si un utilisateur peut être parrainé
export async function canBeReferred(email: string, phone: string): Promise<{
  canRefer: boolean;
  reason?: string;
}> {
  // Cette fonction sera appelée côté client avec la logique Supabase
  // Pour l'instant, on retourne true par défaut
  return { canRefer: true };
}

// Générer un message de partage personnalisé
export function generateShareMessage(userName: string, referralCode: string): {
  whatsapp: string;
  telegram: string;
  sms: string;
} {
  const baseMessage = `Salut ! 🛒 Je viens de découvrir Aumarché, une super appli pour commander des produits frais en Côte d'Ivoire ! 

🎁 Inscris-toi avec mon code ${referralCode} et on gagne tous les deux des avantages exclusifs !

📱 Télécharge l'app ici :`;

  return {
    whatsapp: `${baseMessage} https://aumarche.ci/signup?ref=${referralCode}`,
    telegram: `${baseMessage} https://aumarche.ci/signup?ref=${referralCode}`,
    sms: `${baseMessage} https://aumarche.ci/signup?ref=${referralCode}`,
  };
}