import { HunterRank, HunterRankDetail } from '../types';

// L'objectif et la date cible ne sont plus des constantes en dur.
// Ils sont stockés par utilisateur dans l'entité UserObjective (Supabase + localStorage).
// Les valeurs ci-dessous sont uniquement des défauts pour l'écran d'onboarding.
export const DEFAULT_TARGET_USD = 100000;
export const DEFAULT_TARGET_DATE = '2027-01-11';

export const FOCUSING_QUESTION =
  "Quelle est LA chose que je peux faire aujourd'hui, telle qu'en la faisant, tout le reste deviendrait plus facile ou inutile ?";

export const HUNTER_RANKS: Record<HunterRank, HunterRankDetail> = {
  E: {
    rank: 'E',
    chrisDoStage: 'Survie',
    subtitle: 'Niveau d\'Éveil',
    criteria: 'Missions ponctuelles, revenu imprévisible, acceptation de tout, aucune spécialisation.',
    colorClass: 'text-gray-400',
    badgeBorder: 'border-gray-600/60',
    badgeBg: 'bg-gradient-to-br from-[#2A2538] to-[#1F1B2B]',
    glowColor: 'rgba(100, 116, 139, 0.25)',
  },
  D: {
    rank: 'D',
    chrisDoStage: 'Stabilité',
    subtitle: 'Chasseur Établi',
    criteria: 'Profil client idéal identifié, portfolio de 3 à 5 études de cas ciblées, premiers revenus réguliers.',
    colorClass: 'text-indigo-300',
    badgeBorder: 'border-[#3A2F5C]',
    badgeBg: 'bg-gradient-to-br from-[#3A2F5C]/80 to-[#1D1733]',
    glowColor: 'rgba(58, 47, 92, 0.4)',
  },
  C: {
    rank: 'C',
    chrisDoStage: 'Ambition',
    subtitle: 'Forfait & Spécialisation',
    criteria: 'Tarification au forfait, processus d\'offre formalisé, positionnement clair, premiers 3-5k$/mois.',
    colorClass: 'text-amber-300',
    badgeBorder: 'border-[#C9A070]/60',
    badgeBg: 'bg-gradient-to-br from-[#C9A070]/30 to-[#2A2016]',
    glowColor: 'rgba(201, 160, 112, 0.35)',
  },
  B: {
    rank: 'B',
    chrisDoStage: 'Systématisation',
    subtitle: 'Processus Structuré',
    criteria: 'Processus en 5 étapes documenté, premiers 5-8k$/mois réguliers, rétention client amorcée.',
    colorClass: 'text-emerald-400',
    badgeBorder: 'border-[#4ADE9A]/60',
    badgeBg: 'bg-gradient-to-br from-[#4ADE9A]/20 to-[#122A1E]',
    glowColor: 'rgba(74, 222, 154, 0.35)',
  },
  A: {
    rank: 'A',
    chrisDoStage: 'Croissance',
    subtitle: 'Élite Chasseur',
    criteria: 'Flux de prospects constant, délégation commencée, 10-12 prospects qualifiés/mois, trésorerie solide.',
    colorClass: 'text-[#A87FE8]',
    badgeBorder: 'border-[#A87FE8]/80',
    badgeBg: 'bg-gradient-to-br from-[#6600CC]/50 via-[#A87FE8]/30 to-[#1F1435]',
    glowColor: 'rgba(168, 127, 232, 0.5)',
  },
  S: {
    rank: 'S',
    chrisDoStage: 'Pérennisation',
    subtitle: 'Le Rang Class S',
    criteria: 'Équipe formée, standards documentés, patrimoine protégé, marque de référence — Le rang Class S.',
    colorClass: 'text-transparent bg-clip-text bg-gradient-to-r from-[#A87FE8] via-[#C9A070] to-[#FFFFFF]',
    badgeBorder: 'border-transparent bg-gradient-to-r from-[#6600CC] via-[#A87FE8] to-[#C9A070] p-[1.5px]',
    badgeBg: 'bg-gradient-to-br from-[#1F0A3D] via-[#2D1452] to-[#190F24]',
    glowColor: 'rgba(168, 127, 232, 0.75)',
  },
};

export const ACTIVITY_COLORS = [
  '#6600CC', // Violet Impérial
  '#A87FE8', // Améthyste
  '#C9A070', // Champagne
  '#4ADE9A', // Positif vert
  '#5EC8D8', // Cyan Aura
  '#E8546B', // Négatif corail
  '#F59E0B', // Ambre
  '#EC4899', // Rose fuchsia
];

export const ACTIVITY_ICONS = [
  'Sparkles',
  'Crown',
  'Layers',
  'Palette',
  'Flame',
  'Zap',
  'Code',
  'Briefcase',
  'Shield',
  'Sword',
  'Globe',
  'Rocket'
];

export const REVENUE_CATEGORIES = [
  'Direction Artistique',
  'Branding & Identité',
  'UI/UX Design',
  'Design Graphique',
  'Motion Design',
  'Conseil & Stratégie',
  'Abonnement Design',
  'Autre Prestation'
];

export const EXPENSE_CATEGORIES = [
  'Logiciels & Outils',
  'Matériel & Équipement',
  'Loyer Studio',
  'Télécom & Internet',
  'Freelances & Sous-traitance',
  'Marketing & Visibilité',
  'Impôts & Taxes',
  'Frais Bancaires',
  'Autre Dépense'
];
