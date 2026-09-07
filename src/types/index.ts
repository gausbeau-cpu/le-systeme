export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface HunterRankDetail {
  rank: HunterRank;
  chrisDoStage: string;
  subtitle: string;
  criteria: string;
  colorClass: string;
  badgeBorder: string;
  badgeBg: string;
  glowColor: string;
}

export interface Client {
  id: string;
  uid: string;
  nom: string;
  entreprise?: string;
  email?: string;
  telephone?: string;
  activite_ids?: string[];
  statut: 'prospect' | 'actif' | 'dormant';
  date_creation: string;
  note?: string;
}

export interface Activity {
  id: string;
  uid: string;
  nom: string;
  couleur: string;
  icone: string;
  date_creation: string;
  statut: 'active' | 'pause' | 'archivee';
  rang_actuel: HunterRank;
}

export interface Transaction {
  id: string;
  uid: string;
  date: string;
  montant_original: number;
  devise_origine: 'USD' | 'XOF' | string;
  montant_usd: number;
  type: 'revenu' | 'depense';
  activite_id: string;
  client_id?: string;
  categorie: string;
  note?: string;
}

export type RecurringExpenseNature =
  | 'abonnement'
  | 'loyer'
  | 'salaire'
  | 'cotisation'
  | 'telecom'
  | 'assurance'
  | 'autre';

export interface RecurringExpense {
  id: string;
  uid: string;
  nom: string;
  nature: RecurringExpenseNature;
  activite_id?: string;
  montant_original: number;
  devise_origine: 'USD' | 'XOF' | string;
  montant_usd: number;
  frequence: 'mensuelle' | 'trimestrielle' | 'annuelle';
  date_premier_paiement: string;
  date_fin?: string;
  statut: 'actif' | 'pause' | 'termine';
}

export interface DailyTask {
  id: string;
  uid: string;
  titre: string;
  activite_id?: string;
  date: string; // YYYY-MM-DD
  est_la_priorite: boolean; // strictly max one per date
  statut: 'a_faire' | 'en_cours' | 'terminee';
  note?: string;
}

export interface ProfitFirstSettings {
  profit: number;     // default 5%
  owner_pay: number;  // default 50%
  tax: number;        // default 15%
  opex: number;       // default 30%
}

// Entité Objectif — liée au uid utilisateur, définie lors de l'onboarding
export interface UserObjective {
  id: string;
  uid: string;
  montant_cible: number;  // en USD
  date_cible: string;     // YYYY-MM-DD
  date_creation: string;
}

export interface UserSettings {
  uid: string;
  profit_first: ProfitFirstSettings;
  xof_to_usd_rate: number; // default 0.00165 (~606 XOF / USD)
  rate_updated_at: string;
  currency_api_url?: string;
  opex_alert_threshold: number; // default 30%
  showcase_interests: string[]; // ['portal', 'shadows', 'dungeon', 'grimoire']
}

export type SyncState = 'synced' | 'syncing' | 'error' | 'offline';

export type ActivePage =
  | 'status'
  | 'transactions'
  | 'recurring'
  | 'activities'
  | 'daily'
  | 'forecast'
  | 'portal'
  | 'shadows'
  | 'dungeon'
  | 'grimoire'
  | 'settings';
