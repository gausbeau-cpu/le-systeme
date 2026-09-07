import React from 'react';
import { ActivePage } from '../../types';
import { SyncIndicator } from '../common/SyncIndicator';
import { useSystemData } from '../../context/SystemDataContext';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  onOpenNewTransaction: () => void;
  onSelectPage: (page: ActivePage) => void;
}

const PAGE_TITLES: Record<ActivePage, { title: string; subtitle: string }> = {
  status: {
    title: 'Fenêtre de Statut',
    subtitle: 'Tableau de bord de chasseur • Progression vers le Rang S (100k$)',
  },
  transactions: {
    title: 'Transactions & Trésorerie',
    subtitle: 'Historique des flux de revenus et dépenses convertis en USD',
  },
  recurring: {
    title: 'Charges Récurrentes',
    subtitle: 'Abonnements logiciels et charges fixes de fonctionnement',
  },
  activities: {
    title: 'Mes Activités Économiques',
    subtitle: 'Progression des branches de valeur selon le framework Chris Do',
  },
  daily: {
    title: 'Quête Quotidienne',
    subtitle: 'The One Thing • La Question Ciblante de chaque journée',
  },
  forecast: {
    title: 'Prévisions & Trajectoire',
    subtitle: 'Projections réalistes basées sur tes données historiques réelles',
  },
  portal: {
    title: 'Portail (Facturation & Paiements)',
    subtitle: 'Génération de devis, factures multi-paiements et liens clients',
  },
  shadows: {
    title: 'Armée des Ombres (CRM)',
    subtitle: 'Gestion clientèle, pipeline commercial et valeur des relations',
  },
  dungeon: {
    title: 'Donjon (Commandes & Projets)',
    subtitle: 'Avancement par étapes de production, time tracking et livrables',
  },
  grimoire: {
    title: 'Grimoire (Catalogue & Rentabilité)',
    subtitle: 'Techniques maîtrisées, marges calculées et prestations phares',
  },
  settings: {
    title: 'Réglages du Système',
    subtitle: 'Paramétrage Profit First, devises, cloud Supabase et exports',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onOpenNewTransaction,
  onSelectPage,
}) => {
  const { syncState, syncErrorMessage, triggerManualSync } = useSystemData();
  const { user } = useAuth();

  const currentInfo = PAGE_TITLES[activePage] || {
    title: 'Le Système',
    subtitle: 'Class S',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 bg-[#0D0A18]/80 backdrop-blur-xl border-b border-[#A87FE8]/15">
      {/* Title block */}
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-jost flex items-center gap-2">
          {currentInfo.title}
        </h1>
        <p className="text-xs text-white/50 hidden sm:block font-normal">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Actions & Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sync Status Badge */}
        <SyncIndicator
          state={syncState}
          errorMessage={syncErrorMessage}
          onRetry={triggerManualSync}
        />

        {/* Quick Add Transaction CTA */}
        <button
          onClick={onOpenNewTransaction}
          className="btn-cta inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#6600CC]/30 hover:opacity-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nouvelle Transaction</span>
          <span className="sm:hidden">Transaction</span>
        </button>

        {/* User profile button */}
        <button
          onClick={() => onSelectPage('settings')}
          className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6600CC] via-[#A87FE8] to-[#C9A070] p-[1.5px] shadow-md">
            <div className="w-full h-full rounded-[10px] bg-[#0D0A18] flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xs font-bold text-[#A87FE8]">SN</span>
              )}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
