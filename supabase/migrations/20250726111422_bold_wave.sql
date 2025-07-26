/*
  # Schema initial pour Aumarché

  1. Tables principales
    - `users` - Profils utilisateurs avec système de parrainage
    - `parrainages` - Relation parrain/filleul avec suivi
    - `commandes` - Historique des commandes clients
    - `recompenses` - Système de récompenses par niveau

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour chaque type d'utilisateur
    - Contraintes d'unicité pour éviter les doublons

  3. Fonctionnalités
    - Codes de parrainage uniques
    - Système de niveaux automatique
    - Triggers pour mise à jour des récompenses
*/

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  email text UNIQUE NOT NULL,
  telephone text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'parrain', 'admin')),
  parrain_id uuid REFERENCES users(id),
  code_parrainage text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des parrainages
CREATE TABLE IF NOT EXISTS parrainages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parrain_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filleul_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date timestamptz DEFAULT now(),
  statut text NOT NULL DEFAULT 'valide' CHECK (statut IN ('en_attente', 'valide', 'refuse')),
  lien_parrainage text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(filleul_id) -- Un filleul ne peut avoir qu'un seul parrain
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS commandes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  montant decimal(10,2) NOT NULL DEFAULT 0,
  date timestamptz DEFAULT now(),
  statut text NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'livree', 'annulee')),
  created_at timestamptz DEFAULT now()
);

-- Table des récompenses
CREATE TABLE IF NOT EXISTS recompenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reduction', 'cashback', 'badge', 'premium', 'livraison_gratuite')),
  palier integer NOT NULL DEFAULT 1,
  date timestamptz DEFAULT now(),
  statut text NOT NULL DEFAULT 'active' CHECK (statut IN ('active', 'utilisee', 'expiree')),
  valeur decimal(10,2) NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_parrain_id ON users(parrain_id);
CREATE INDEX IF NOT EXISTS idx_users_code_parrainage ON users(code_parrainage);
CREATE INDEX IF NOT EXISTS idx_parrainages_parrain_id ON parrainages(parrain_id);
CREATE INDEX IF NOT EXISTS idx_parrainages_filleul_id ON parrainages(filleul_id);
CREATE INDEX IF NOT EXISTS idx_commandes_user_id ON commandes(user_id);
CREATE INDEX IF NOT EXISTS idx_recompenses_user_id ON recompenses(user_id);

-- Fonction pour générer un code de parrainage unique
CREATE OR REPLACE FUNCTION generate_referral_code(user_name text)
RETURNS text AS $$
DECLARE
  clean_name text;
  timestamp_part text;
  random_part text;
  final_code text;
BEGIN
  -- Nettoyer le nom (3 premières lettres)
  clean_name := UPPER(LEFT(REGEXP_REPLACE(user_name, '[^a-zA-Z]', '', 'g'), 3));
  clean_name := RPAD(clean_name, 3, 'X');
  
  -- Partie timestamp (4 caractères)
  timestamp_part := UPPER(RIGHT(TO_CHAR(EXTRACT(EPOCH FROM NOW())::integer, 'XXXXXXXXX'), 4));
  
  -- Partie aléatoire (2 caractères)
  random_part := UPPER(LEFT(MD5(RANDOM()::text), 2));
  
  final_code := clean_name || timestamp_part || random_part;
  
  RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le code de parrainage
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code_parrainage IS NULL OR NEW.code_parrainage = '' THEN
    NEW.code_parrainage := generate_referral_code(NEW.nom);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Trigger pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Fonction pour calculer le niveau d'un parrain
CREATE OR REPLACE FUNCTION calculate_parrain_level(parrain_uuid uuid)
RETURNS integer AS $$
DECLARE
  filleuls_count integer;
  niveau integer;
BEGIN
  SELECT COUNT(*) INTO filleuls_count
  FROM parrainages
  WHERE parrain_id = parrain_uuid AND statut = 'valide';
  
  -- Calcul du niveau basé sur le nombre de filleuls
  IF filleuls_count >= 50 THEN
    niveau := 5;
  ELSIF filleuls_count >= 20 THEN
    niveau := 4;
  ELSIF filleuls_count >= 10 THEN
    niveau := 3;
  ELSIF filleuls_count >= 3 THEN
    niveau := 2;
  ELSE
    niveau := 1;
  END IF;
  
  RETURN niveau;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer automatiquement les récompenses lors d'un nouveau parrainage
CREATE OR REPLACE FUNCTION create_parrainage_rewards()
RETURNS TRIGGER AS $$
DECLARE
  current_level integer;
  previous_level integer;
  filleuls_count integer;
BEGIN
  IF NEW.statut = 'valide' THEN
    -- Compter les filleuls validés du parrain
    SELECT COUNT(*) INTO filleuls_count
    FROM parrainages
    WHERE parrain_id = NEW.parrain_id AND statut = 'valide';
    
    current_level := calculate_parrain_level(NEW.parrain_id);
    previous_level := calculate_parrain_level(NEW.parrain_id);
    
    -- Si changement de niveau, créer les récompenses appropriées
    IF filleuls_count = 3 THEN
      INSERT INTO recompenses (user_id, type, palier, valeur, description)
      VALUES (NEW.parrain_id, 'cashback', 2, 5.00, 'Bonus 5% - Niveau 2 atteint');
    ELSIF filleuls_count = 10 THEN
      INSERT INTO recompenses (user_id, type, palier, valeur, description)
      VALUES (NEW.parrain_id, 'cashback', 3, 10.00, 'Bonus 10% - Niveau 3 atteint');
      INSERT INTO recompenses (user_id, type, palier, valeur, description)
      VALUES (NEW.parrain_id, 'livraison_gratuite', 3, 0, 'Livraison gratuite à vie');
    ELSIF filleuls_count = 20 THEN
      INSERT INTO recompenses (user_id, type, palier, valeur, description)
      VALUES (NEW.parrain_id, 'cashback', 4, 15.00, 'Bonus 15% - Niveau 4 atteint');
      INSERT INTO recompenses (user_id, type, palier, valeur, description)
      VALUES (NEW.parrain_id, 'premium', 4, 0, 'Accès VIP aux nouveautés');
    ELSIF filleuls_count = 50 THEN
      INSERT INTO recompenses (user_id, type, palier, valeur, description)
      VALUES (NEW.parrain_id, 'cashback', 5, 20.00, 'Bonus 20% - Niveau VIP atteint');
    END IF;
    
    -- Récompense pour le filleul
    INSERT INTO recompenses (user_id, type, palier, valeur, description)
    VALUES (NEW.filleul_id, 'reduction', 1, 5.00, 'Bonus de bienvenue - Parrainage');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_parrainage_rewards
  AFTER INSERT OR UPDATE ON parrainages
  FOR EACH ROW
  EXECUTE FUNCTION create_parrainage_rewards();

-- Sécurité RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parrainages ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recompenses ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read public user info for referrals"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour la table parrainages
CREATE POLICY "Users can read own parrainages"
  ON parrainages
  FOR SELECT
  TO authenticated
  USING (parrain_id = auth.uid() OR filleul_id = auth.uid());

CREATE POLICY "Users can create parrainages"
  ON parrainages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all parrainages"
  ON parrainages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour la table commandes
CREATE POLICY "Users can read own commandes"
  ON commandes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own commandes"
  ON commandes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all commandes"
  ON commandes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour la table recompenses
CREATE POLICY "Users can read own recompenses"
  ON recompenses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create recompenses"
  ON recompenses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own recompenses status"
  ON recompenses
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all recompenses"
  ON recompenses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vues pour les statistiques (accessible aux admins)
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
  (SELECT COUNT(*) FROM parrainages WHERE statut = 'valide') as total_parrainages,
  (SELECT COUNT(*) FROM commandes) as total_commandes,
  (SELECT COALESCE(SUM(montant), 0) FROM commandes WHERE statut = 'livree') as total_revenue,
  (SELECT COUNT(*) FROM recompenses WHERE statut = 'active') as active_rewards;

-- Données de test (optionnel - à supprimer en production)
-- Créer un admin par défaut
INSERT INTO users (nom, email, telephone, role, code_parrainage)
VALUES ('Admin Aumarché', 'admin@aumarche.ci', '+22507000000', 'admin', 'ADMIN001')
ON CONFLICT (email) DO NOTHING;