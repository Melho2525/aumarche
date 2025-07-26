// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// ✅ Vérification explicite des variables d’environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ Supabase URL et/ou Anon Key manquants dans l'environnement.");
}

// ✅ Initialisation du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// 🧩 Types & Enums pour les entités

export type RoleUser = 'client' | 'parrain' | 'admin';

export interface User {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: RoleUser;
  parrain_id?: string;
  created_at: string;
  updated_at: string;
}

export type StatutParrainage = 'en_attente' | 'valide' | 'refuse';

export interface Parrainage {
  id: string;
  parrain_id: string;
  filleul_id: string;
  date: string;
  statut: StatutParrainage;
  lien_parrainage: string;
}

export type StatutCommande = 'en_cours' | 'livree' | 'annulee';

export interface Commande {
  id: string;
  user_id: string;
  montant: number;
  date: string;
  statut: StatutCommande;
}

export type StatutRecompense = 'active' | 'utilisee' | 'expiree';

export type TypeRecompense = 'reduction' | 'cashback' | 'badge' | 'premium';

export interface Recompense {
  id: string;
  user_id: string;
  type: TypeRecompense;
  palier: number;
  date: string;
  statut: StatutRecompense;
  valeur: number;
}

// 🛠 Fonction utilitaire pour récupérer l'utilisateur connecté
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erreur récupération utilisateur:", error.message);
    return null;
  }
  return data.user;
}
