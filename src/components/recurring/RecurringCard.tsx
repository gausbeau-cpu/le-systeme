import React from 'react';
import { RecurringExpense, Activity } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { formatUSD, formatOriginalCurrency, formatDateFr } from '../../lib/utils';
import { getNormalizedMonthlyCost } from '../../lib/calculations';
import { Power, Trash2, Calendar, Edit3, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RecurringCardProps {
  expense: RecurringExpense;
  activity?: Activity;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RecurringCard: React.FC<RecurringCardProps> = ({
  expense,
  activity,
  onToggleStatus,
  onDelete,
}) => {
  const isActive = expense.statut === 'actif';
  const monthlyCost = getNormalizedMonthlyCost(expense);

  return (
    <GlassCard
      className={cn(
        'p-5 flex flex-col justify-between transition-all group',
        !isActive && 'opacity-60 border-white/5'
      )}
    >
      <div>
        {/* Top bar: Frequency, Nature, Status Toggle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6600CC]/30 border border-[#A87FE8]/40 text-[#A87FE8]">
              {expense.frequence}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/60">
              {expense.nature}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleStatus(expense.id)}
              className={cn(
                'px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors',
                isActive
                  ? 'bg-emerald-500/20 text-[#4ADE9A] hover:bg-emerald-500/30'
                  : 'bg-white/10 text-white/40 hover:text-white'
              )}
              title={isActive ? 'Mettre en pause' : 'Réactiver'}
            >
              <Power className="w-3 h-3" />
              <span>{isActive ? 'Actif' : 'En pause'}</span>
            </button>

            <button
              onClick={() => onDelete(expense.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Activity */}
        <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
          {expense.nom}
        </h3>
        {activity ? (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1.5"
            style={{
              backgroundColor: `${activity.couleur}20`,
              borderColor: `${activity.couleur}50`,
              color: activity.couleur,
            }}
          >
            {activity.nom}
          </span>
        ) : (
          <span className="inline-block text-[11px] text-white/40 mt-1">
            Studio / Global
          </span>
        )}
      </div>

      {/* Financials & Dates */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-white tabular-nums font-jost">
              {formatUSD(monthlyCost, 0)}
            </span>
            <span className="text-xs text-white/40 font-normal"> /mois</span>
          </div>
          {expense.devise_origine !== 'USD' && (
            <span className="block text-[10px] text-white/40 tabular-nums">
              {formatOriginalCurrency(expense.montant_original, expense.devise_origine)} / {expense.frequence}
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10px] text-white/40 block">1er prélèvement</span>
          <span className="text-[11px] font-medium text-white/70">
            {formatDateFr(expense.date_premier_paiement)}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
