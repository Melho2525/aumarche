import { createClient, User, Session, AuthResponse } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// -------- Vérifie si un utilisateur existe déjà --------
export async function checkIfUserExists(email: string, telephone: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},telephone.eq.${telephone}`);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

// -------- Vérifie si le code parrain existe --------
export async function isParrainCodeValid(code: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('code_parrainage', code)
    .single();

  if (error) return null;
  return data?.id ?? null;
}

// -------- Génère un code parrainage unique --------
export async function generateUniqueParrainCode(nom: string): Promise<string> {
  const base = nom.slice(0, 3).toUpperCase();
  let code = '';
  let exists = true;

  while (exists) {
    code = `${base}${Math.floor(Math.random() * 1_000_000)}`; // ex: ABC453928
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('code_parrainage', code);
    exists = !!(data && data.length > 0);
  }

  return code;
}

// -------- Types --------
export interface SignUpParams {
  email: string;
  password: string;
  nom: string;
  telephone: string;
  parrainCode?: string;
}

export interface SignUpResult {
  user: User | null;
  session: Session | null;
}

// -------- Inscription avec e-mail --------
export async function signUpWithEmail(params: SignUpParams): Promise<SignUpResult> {
  const { email, password, nom, telephone, parrainCode } = params;

  // Vérification d'existence
  const userExists = await checkIfUserExists(email, telephone);
  if (userExists) throw new Error('Email ou téléphone déjà utilisé.');

  // Vérification du code parrainage
  let parrainId: string | null = null;
  if (parrainCode) {
    parrainId = await isParrainCodeValid(parrainCode);
    if (!parrainId) throw new Error('Code de parrainage invalide.');
  }

  // Inscription Supabase
  const { data: signUpData, error: signUpError }: AuthResponse = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  const userId = signUpData.user?.id;
  if (!userId) throw new Error('Inscription échouée.');

  // Création du profil utilisateur
  const code_parrainage = await generateUniqueParrainCode(nom);
  const { error: profileError } = await supabase.from('users').insert([
    {
      id: userId,
      nom,
      email,
      telephone,
      parrain_id: parrainId,
      code_parrainage,
    },
  ]);
  if (profileError) throw profileError;

  // Création du lien de parrainage
  if (parrainId) {
    const { error: parrainageError } = await supabase.from('parrainages').insert([
      {
        parrain_id: parrainId,
        filleul_id: userId,
      },
    ]);
    if (parrainageError) throw parrainageError;
  }

  return { user: signUpData.user, session: signUpData.session };
}

// -------- Connexion --------
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// -------- Connexion via OTP (téléphone) --------
export async function signInWithOTP(telephone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: telephone,
  });
  if (error) throw error;
  return data;
}

// -------- Récupère l'utilisateur connecté --------
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user ?? null;
}

// -------- Déconnexion --------
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// -------- Vérifie si l'utilisateur est admin --------
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) return false;
  return data?.role === 'admin';
}

// -------- Vérifie si un utilisateur est déjà parrainé --------
export async function checkIfAlreadyReferred(email: string, telephone: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},telephone.eq.${telephone}`);

  if (error) return false;
  return (data?.length ?? 0) > 0;
}
