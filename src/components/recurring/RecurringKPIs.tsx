import React from 'react';
import { RecurringExpense, Activity } from '../../types';
import { getNormalizedMonthlyCost } from '../../lib/calculations';
import { formatUSD } from '../../lib/utils';
import { GlassCard } from '../common/GlassCard';
import { Repeat, Calendar, PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

interface RecurringKPIsProps {
  recurringExpenses: RecurringExpense[];
  activities: Activity[];
}

export const RecurringKPIs: React.FC<RecurringKPIsProps> = ({
  recurringExpenses,
  activities,
}) => {
  const activeExpenses = recurringExpenses.filter((e) => e.statut === 'actif');
  const monthlyTotal = activeExpenses.reduce((sum, e) => sum + getNormalizedMonthlyCost(e), 0);
  const annualTotal = monthlyTotal * 12;

  // Breakdown by activity
  const activityMap: Record<string, { name: string; cost: number; color: string }> = {};
  activeExpenses.forEach((e) => {
    const act = activities.find((a) => a.id === e.activite_id);
    const key = act?.id || 'global';
    const name = act?.nom || 'Frais Généraux / Studio';
    const color = act?.couleur || '#A87FE8';
    if (!activityMap[key]) {
      activityMap[key] = { name, cost: 0, color };
    }
    activityMap[key].cost += getNormalizedMonthlyCost(e);
  });

  const pieData = Object.values(activityMap);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Monthly Total */}
      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold block">
            Coût Fixe Mensuel Normalisé
          </span>
          <span className="text-2xl font-bold text-white tabular-nums tracking-tight font-jost mt-1 block">
            {formatUSD(monthlyTotal, 0)}
            <span className="text-xs text-white/40 font-normal"> /mois</span>
          </span>
          <span className="text-[11px] text-white/50 mt-1 block">
            {activeExpenses.length} charge{activeExpenses.length > 1 ? 's' : ''} active{activeExpenses.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#6600CC]/20 border border-[#A87FE8]/30 flex items-center justify-center text-[#A87FE8]">
          <Repeat className="w-6 h-6" />
        </div>
      </GlassCard>

      {/* Annual Projected */}
      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold block">
            Coût Annuel Projeté
          </span>
          <span className="text-2xl font-bold text-[#C9A070] tabular-nums tracking-tight font-jost mt-1 block">
            {formatUSD(annualTotal, 0)}
            <span className="text-xs text-[#C9A070]/60 font-normal"> /an</span>
          </span>
          <span className="text-[11px] text-white/50 mt-1 block">
            Engagements fixes sur 12 mois
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#C9A070]/20 border border-[#C9A070]/30 flex items-center justify-center text-[#C9A070]">
          <Calendar className="w-6 h-6" />
        </div>
      </GlassCard>

      {/* Mini Donut Chart */}
      <GlassCard className="p-4 flex items-center justify-between gap-2">
        <div className="flex flex-col justify-center">
          <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold block">
            Répartition par Pôle
          </span>
          <span className="text-xs text-white/80 mt-1 font-medium">
            {pieData.length} pôle{pieData.length > 1 ? 's' : ''} de coût
          </span>
        </div>
        <div className="w-20 h-20 relative">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  dataKey="cost"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={24}
                  outerRadius={36}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center text-[10px] text-white/40">
              0
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
