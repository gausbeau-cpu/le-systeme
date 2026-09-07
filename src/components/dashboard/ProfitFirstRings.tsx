import React from 'react';
import { ProfitFirstSettings, RecurringExpense } from '../../types';
import { calculateProfitFirst, getNormalizedMonthlyCost } from '../../lib/calculations';
import { formatUSD } from '../../lib/utils';
import { GlassCard } from '../common/GlassCard';
import { ShieldAlert, PieChart, Info, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface ProfitFirstRingsProps {
  totalRevenueUSD: number;
  settings: ProfitFirstSettings;
  recurringExpenses: RecurringExpense[];
  onOpenSettings?: () => void;
}

export const ProfitFirstRings: React.FC<ProfitFirstRingsProps> = ({
  totalRevenueUSD,
  settings,
  recurringExpenses,
  onOpenSettings,
}) => {
  const activeRecurringMonthly = recurringExpenses
    .filter((e) => e.statut === 'actif')
    .reduce((sum, e) => sum + getNormalizedMonthlyCost(e), 0);

  const {
    profitUSD,
    ownerPayUSD,
    taxUSD,
    opexUSD,
    opexWarning,
    recurringOpexRatio,
  } = calculateProfitFirst(totalRevenueUSD, settings, activeRecurringMonthly);

  const envelopes = [
    {
      name: 'Rémunération Fondateur',
      percentage: settings.owner_pay,
      amount: ownerPayUSD,
      color: '#6600CC',
      fillGradient: '#8B5CF6',
    },
    {
      name: 'Frais d\'Exploitation (OPEX)',
      percentage: settings.opex,
      amount: opexUSD,
      color: '#A87FE8',
      fillGradient: '#A87FE8',
      isOpex: true,
    },
    {
      name: 'Impôts & Taxes',
      percentage: settings.tax,
      amount: taxUSD,
      color: '#C9A070',
      fillGradient: '#E5C088',
    },
    {
      name: 'Profit Net',
      percentage: settings.profit,
      amount: profitUSD,
      color: '#4ADE9A',
      fillGradient: '#4ADE9A',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#C9A070]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/80 font-jost">
            Enveloppes Profit First (Mike Michalowicz)
          </h2>
        </div>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-xs text-[#C9A070] hover:text-white transition-colors font-medium"
          >
            Ajuster les %
          </button>
        )}
      </div>

      {/* Warning if recurring charges exceed OPEX */}
      {opexWarning && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-3 backdrop-blur-md">
          <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-white">
              Alerte Trésorerie • Dépassement Frais d'Exploitation
            </span>
            <span>
              Tes charges récurrentes actives ({formatUSD(activeRecurringMonthly, 0)}/mois) représentent{' '}
              <strong className="text-rose-300 font-bold">{recurringOpexRatio.toFixed(0)}%</strong> de ton enveloppe
              OPEX ({formatUSD(opexUSD, 0)}), au-dessus de ton plafond de {settings.opex}%.
            </span>
          </div>
        </div>
      )}

      {/* 4 Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {envelopes.map((env, idx) => {
          const radialData = [
            {
              name: env.name,
              value: env.percentage,
              fill: env.color,
            },
          ];

          return (
            <GlassCard key={idx} className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white/80 line-clamp-1">{env.name}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${env.color}25`,
                    color: env.color,
                    border: `1px solid ${env.color}50`,
                  }}
                >
                  {env.percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 my-2">
                <div>
                  <span className="text-xl font-bold text-white tabular-nums tracking-tight font-jost">
                    {formatUSD(env.amount, 0)}
                  </span>
                  {env.isOpex && activeRecurringMonthly > 0 && (
                    <span className="block text-[11px] text-white/50 mt-0.5">
                      Charges fixes : {formatUSD(activeRecurringMonthly, 0)}/m
                    </span>
                  )}
                </div>

                <div className="w-14 h-14 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      barSize={6}
                      data={radialData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar
                        background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        dataKey="value"
                        cornerRadius={6}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/70">
                    {env.percentage}%
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
