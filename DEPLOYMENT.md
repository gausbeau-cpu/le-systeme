# Guide de Déploiement & Configuration Supabase — "Le Système" (Class S)

Ce document résume toutes les étapes pour déployer l'application sur **Vercel** et connecter le projet **Supabase** (`le_systeme`).

---

## 1. Schéma des Tables Supabase (SQL)

Exécute le script SQL suivant dans le **SQL Editor** de ton projet Supabase (`https://supabase.com/dashboard/project/znhqmvxffhqrtikeeirg/sql`) :

```sql
-- Active l'extension UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Objectif Utilisateur (User Objectives)
CREATE TABLE IF NOT EXISTS user_objectives (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  montant_cible NUMERIC NOT NULL,
  date_cible DATE NOT NULL,
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user_objective UNIQUE (uid)
);

-- 2. Table Clients
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  nom TEXT NOT NULL,
  entreprise TEXT,
  email TEXT,
  telephone TEXT,
  activite_ids TEXT[],
  statut TEXT DEFAULT 'prospect',
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

-- 3. Table Activités
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  nom TEXT NOT NULL,
  couleur TEXT NOT NULL,
  icone TEXT NOT NULL,
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  statut TEXT DEFAULT 'active',
  rang_actuel TEXT DEFAULT 'E'
);

-- 4. Table Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  date DATE NOT NULL,
  montant_original NUMERIC NOT NULL,
  devise_origine TEXT NOT NULL,
  montant_usd NUMERIC NOT NULL,
  type TEXT NOT NULL, -- 'revenu' ou 'depense'
  activite_id TEXT NOT NULL,
  client_id TEXT,
  categorie TEXT NOT NULL,
  note TEXT
);

-- 5. Table Charges Récurrentes
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  nom TEXT NOT NULL,
  nature TEXT NOT NULL,
  activite_id TEXT,
  montant_original NUMERIC NOT NULL,
  devise_origine TEXT NOT NULL,
  montant_usd NUMERIC NOT NULL,
  frequence TEXT NOT NULL, -- 'mensuelle', 'trimestrielle', 'annuelle'
  date_premier_paiement DATE NOT NULL,
  date_fin DATE,
  statut TEXT DEFAULT 'actif'
);

-- 6. Table Quête Quotidienne (Daily Tasks)
CREATE TABLE IF NOT EXISTS daily_tasks (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  titre TEXT NOT NULL,
  activite_id TEXT,
  date DATE NOT NULL,
  est_la_priorite BOOLEAN DEFAULT FALSE,
  statut TEXT DEFAULT 'a_faire',
  note TEXT
);

-- 7. Table Réglages Utilisateur
CREATE TABLE IF NOT EXISTS user_settings (
  uid TEXT PRIMARY KEY,
  profit_first JSONB NOT NULL DEFAULT '{"profit": 5, "owner_pay": 50, "tax": 15, "opex": 30}',
  xof_to_usd_rate NUMERIC DEFAULT 0.00165,
  rate_updated_at TIMESTAMPTZ DEFAULT NOW(),
  currency_api_url TEXT,
  opex_alert_threshold NUMERIC DEFAULT 30,
  showcase_interests TEXT[] DEFAULT '{}'
);

-- Activer Row Level Security (RLS) sur toutes les tables
ALTER TABLE user_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS simples : chaque utilisateur accède uniquement à ses propres données via son UID
CREATE POLICY "Users manage own objective" ON user_objectives FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
CREATE POLICY "Users manage own clients" ON clients FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
CREATE POLICY "Users manage own activities" ON activities FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
CREATE POLICY "Users manage own transactions" ON transactions FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
CREATE POLICY "Users manage own recurring" ON recurring_expenses FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
CREATE POLICY "Users manage own tasks" ON daily_tasks FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
CREATE POLICY "Users manage own settings" ON user_settings FOR ALL USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
```

---

## 2. Configuration Supabase Auth

1. **Fournisseur Google** (Supabase Dashboard > Authentication > Providers > Google) :
   - Active Google
   - Renseigne le `Client ID` et le `Client Secret` issus de Google Cloud Console.
   - Dans Google Cloud Console (Identifiants OAuth 2.0) :
     - Ajoute l'URI de redirection Supabase : `https://znhqmvxffhqrtikeeirg.supabase.co/auth/v1/callback`
     - Ajoute tes origines JavaScript autorisées : `http://localhost:3000` et `https://ton-projet.vercel.app`

2. **Redirection d'URL** (Supabase Dashboard > Authentication > URL Configuration) :
   - **Site URL** : `https://ton-projet.vercel.app` (ou ton domaine personnalisé)
   - **Redirect URLs** :
     - `http://localhost:3000/**`
     - `https://ton-projet.vercel.app/**`

---

## 3. Déploiement sur Vercel

1. Importe ton dépôt Git dans Vercel.
2. Définis les variables d'environnement dans **Vercel > Settings > Environment Variables** :
   - `VITE_SUPABASE_URL` = `https://znhqmvxffhqrtikeeirg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(ta clé anon/public disponible dans Supabase > Project Settings > API)*
   - `VITE_CURRENCY_API_URL` = *(optionnel, à renseigner après mise en ligne)*
3. Clique sur **Deploy**.
4. Le fichier [vercel.json](file:///c:/Users/HP/Documents/000_Le%20Syst%C3%A8me_Class%20S/Site%20Web/vercel.json) gère automatiquement la réécriture SPA (`/*` vers `/index.html`).
