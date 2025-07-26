// lib/api.ts

import { supabase } from './supabase';
import type {
  User,
  Parrainage,
  StatutParrainage,
  Commande,
  StatutCommande,
  Recompense,
  StatutRecompense,
  TypeRecompense,
} from './supabase';

/* === USERS === */

// Créer un utilisateur (attention, Supabase Auth gère souvent cette partie)
export async function createUser(user: Partial<User>) {
  const { data, error } = await supabase.from<User, User>('users').insert([user]).single();
  if (error) throw error;
  return data;
}

// Récupérer un utilisateur par ID
export async function getUserById(id: string) {
  const { data, error } = await supabase.from<User, User>('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Mettre à jour un utilisateur
export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase.from<User, User>('users').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

// Supprimer un utilisateur
export async function deleteUser(id: string) {
  const { error } = await supabase.from<User, User>('users').delete().eq('id', id);
  if (error) throw error;
  return true;
}

/* === PARRAINAGES === */

// Ajouter un parrainage
export async function addParrainage(parrain_id: string, filleul_id: string, lien_parrainage: string) {
  const { data, error } = await supabase
    .from<Parrainage, Parrainage>('referrals')
    .insert([{ parrain_id, filleul_id, lien_parrainage, statut: 'en_attente' }])
    .single();
  if (error) throw error;
  return data;
}

// Récupérer tous les parrainages d'un parrain
export async function getParrainagesByParrain(parrain_id: string) {
  const { data, error } = await supabase
    .from<Parrainage, Parrainage>('referrals')
    .select('*')
    .eq('parrain_id', parrain_id);
  if (error) throw error;
  return data;
}

// Mettre à jour le statut d’un parrainage
export async function updateParrainageStatut(id: string, statut: StatutParrainage) {
  const { data, error } = await supabase
    .from<Parrainage, Parrainage>('referrals')
    .update({ statut })
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Supprimer un parrainage
export async function deleteParrainage(id: string) {
  const { error } = await supabase.from<Parrainage, Parrainage>('referrals').delete().eq('id', id);
  if (error) throw error;
  return true;
}

/* === COMMANDES === */

// Ajouter une commande
export async function addCommande(user_id: string, montant: number, statut: StatutCommande = 'en_cours') {
  const { data, error } = await supabase
    .from<Commande, Commande>('orders')
    .insert([{ user_id, montant, statut }])
    .single();
  if (error) throw error;
  return data;
}

// Récupérer toutes les commandes d’un utilisateur
export async function getCommandesByUser(user_id: string) {
  const { data, error } = await supabase
    .from<Commande, Commande>('orders')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw error;
  return data;
}

// Mettre à jour le statut d’une commande
export async function updateCommandeStatut(id: string, statut: StatutCommande) {
  const { data, error } = await supabase
    .from<Commande, Commande>('orders')
    .update({ statut })
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Supprimer une commande
export async function deleteCommande(id: string) {
  const { error } = await supabase.from<Commande, Commande>('orders').delete().eq('id', id);
  if (error) throw error;
  return true;
}

/* === RECOMPENSES === */

// Ajouter une récompense
export async function addRecompense(
  user_id: string,
  type: TypeRecompense,
  palier: number,
  valeur: number,
  statut: StatutRecompense = 'active'
) {
  const { data, error } = await supabase
    .from<Recompense, Recompense>('rewards')
    .insert([{ user_id, type, palier, valeur, statut }])
    .single();
  if (error) throw error;
  return data;
}

// Récupérer toutes les récompenses d’un utilisateur
export async function getRecompensesByUser(user_id: string) {
  const { data, error } = await supabase
    .from<Recompense, Recompense>('rewards')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw error;
  return data;
}

// Mettre à jour le statut d’une récompense
export async function updateRecompenseStatut(id: string, statut: StatutRecompense) {
  const { data, error } = await supabase
    .from<Recompense, Recompense>('rewards')
    .update({ statut })
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Supprimer une récompense
export async function deleteRecompense(id: string) {
  const { error } = await supabase.from<Recompense, Recompense>('rewards').delete().eq('id', id);
  if (error) throw error;
  return true;
}
