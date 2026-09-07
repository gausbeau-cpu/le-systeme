import React, { useState } from 'react';
import { Transaction } from '../../types';
import { calculateForecast, calculateMilestones } from '../../lib/calculations';
import { formatUSD } from '../../lib/utils';
import { GlassCard } from '../common/GlassCard';
import {
  TrendingUp,
  Info,
  ShieldCheck,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts';

interface ForecastChartProps {
  transactions: Transaction[];
  targetUSD: number;
  targetDateStr: string;
  onOpenNewTransaction: () => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  transactions,
  targetUSD,
  targetDateStr,
  onOpenNewTransaction,
}) => {
  const [growthPercent, setGrowthPercent] = useState<number>(0);

  const forecast = calculateForecast(transactions, targetUSD, targetDateStr, growthPercent);
  const milestone = calculateMilestones(transactions, targetUSD, targetDateStr);

  const formattedTargetDate = new Date(targetDateStr + 'T12:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Method & Accuracy */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#A87FE8]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                Méthode de Calcul
              </span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug">
              {forecast.methodLabel}
            </h3>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10">
            <span className="text-xs text-white/60">
              {forecast.monthsCount} mois d'historique réel
            </span>
          </div>
        </GlassCard>

        {/* Projected Total */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                Atterrissage Projeté ({formattedTargetDate})
              </span>
              {forecast.isOptimistic && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                  Optimiste (+50%)
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-white tabular-nums tracking-tight font-jost mt-1">
              {formatUSD(forecast.projectedTotalUSD, 0)}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/60">Objectif visé :</span>
            <span className="font-bold text-[#C9A070]">{formatUSD(targetUSD, 0)}</span>
          </div>
        </GlassCard>

        {/* Floor Target / Projected Average */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block mb-1">
              Moyenne Mensuelle Requise
            </span>
            <div className="text-2xl font-bold text-[#A87FE8] tabular-nums tracking-tight font-jost mt-1">
              {formatUSD(milestone.monthlyRequiredUSD, 0)}
              <span className="text-xs text-white/40 font-normal"> /mois</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 text-xs text-white/60">
            Pour combler les {formatUSD(milestone.remainingUSD, 0)} restants
          </div>
        </GlassCard>
      </div>

      {/* Main Forecast Trajectory Chart */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight font-jost flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#A87FE8]" />
              Trajectoire vers {formatUSD(targetUSD, 0)} ({formattedTargetDate})
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Données réelles cumulées (vert) vs Cible requise (pointillés) vs Projection (améthyste)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#4ADE9A] inline-block rounded" />
              <span className="text-white/70">Réel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#C9A070] border-dashed inline-block" />
              <span className="text-white/70">Cible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#A87FE8] inline-block rounded" />
              <span className="text-white/70">Projection</span>
            </div>
          </div>
        </div>

        {forecast.method === 'insufficient_data' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-[#A87FE8]/25 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#6600CC]/20 border border-[#A87FE8]/30 flex items-center justify-center text-[#A87FE8] mb-3">
              <Info className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Ajoute au moins 2 mois de revenus pour débloquer tes premières prévisions.
            </h4>
            <p className="text-xs text-white/50 max-w-sm mb-4">
              Le Système refuse les prévisions utopiques au doigt mouillé : seules des données réelles sont utilisées.
            </p>
            <button
              onClick={onOpenNewTransaction}
              className="btn-cta px-4 py-2 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-bold"
            >
              + Ajouter une transaction
            </button>
          </div>
        ) : (
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast.chartData}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ADE9A" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#4ADE9A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A87FE8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#A87FE8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#140F26',
                    border: '1px solid rgba(168,127,232,0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: unknown) => [`${formatUSD(Number(val), 0)}`, '']}
                />
                {/* Confidence bounds (regression) */}
                <Area
                  type="monotone"
                  dataKey="projectedHigh"
                  stroke="none"
                  fill="rgba(168, 127, 232, 0.08)"
                  name="Fourchette haute"
                />
                <Area
                  type="monotone"
                  dataKey="projectedLow"
                  stroke="none"
                  fill="rgba(168, 127, 232, 0.08)"
                  name="Fourchette basse"
                />
                {/* Required cumulative line */}
                <Line
                  type="monotone"
                  dataKey="requiredCumulative"
                  stroke="#C9A070"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  name="Cible"
                />
                {/* Projected */}
                <Area
                  type="monotone"
                  dataKey="projectedCumulative"
                  stroke="#A87FE8"
                  strokeWidth={2}
                  fill="url(#projectedGradient)"
                  name="Projection"
                />
                {/* Actual */}
                <Area
                  type="monotone"
                  dataKey="actualCumulative"
                  stroke="#4ADE9A"
                  strokeWidth={3}
                  fill="url(#actualGradient)"
                  name="CA Réel"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

      {/* Interactive Growth Simulator */}
      <GlassCard className="p-6 bg-gradient-to-r from-[#170E2E] to-[#120B24] border-[#A87FE8]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C9A070]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-jost">
              Simulateur Interactif de Croissance
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#C9A070]/20 text-[#C9A070] font-bold">
            Simulation : +{growthPercent}%
          </span>
        </div>

        <p className="text-xs text-white/60 mb-4">
          « Et si j'augmentais mon revenu mensuel moyen de X% ? » Teste l'impact d'une accélération sur ta date d'atteinte du rang S.
        </p>

        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={growthPercent}
            onChange={(e) => setGrowthPercent(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A87FE8]"
          />
          <div className="flex justify-between text-[11px] text-white/40 font-semibold">
            <span>Actuel (0%)</span>
            <span>+25%</span>
            <span>+50%</span>
            <span>+75%</span>
            <span>+100% (Doublement)</span>
          </div>
        </div>
      </GlassCard>

      {/* Transparent Methodology Box */}
      <div className="p-4 rounded-2xl bg-[#0D0A18]/80 border border-white/10 text-xs text-white/60 space-y-1.5">
        <span className="font-bold text-[#A87FE8] block">
          Engagement Méthodologique & Transparence
        </span>
        <p className="leading-relaxed">
          Cette projection est basée sur tes données historiques réelles, pas une estimation arbitraire.
          Moins de 2 mois de données = objectif mensuel plancher strict. De 2 à 5 mois = moyenne mobile.
          À partir de 6 mois = régression linéaire par moindres carrés avec écart-type.
        </p>
      </div>
    </div>
  );
};
