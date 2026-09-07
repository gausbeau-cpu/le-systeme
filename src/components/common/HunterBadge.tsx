import React, { useState } from 'react';
import { HunterRank } from '../../types';
import { HUNTER_RANKS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Info } from 'lucide-react';

interface HunterBadgeProps {
  rank: HunterRank;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showDetails?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const HunterBadge: React.FC<HunterBadgeProps> = ({
  rank,
  size = 'md',
  showDetails = false,
  interactive = false,
  onClick,
  className,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const info = HUNTER_RANKS[rank] || HUNTER_RANKS.E;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold rounded-lg',
    md: 'w-10 h-10 text-base font-extrabold rounded-xl',
    lg: 'w-14 h-14 text-2xl font-black rounded-2xl',
    hero: 'w-20 h-20 text-4xl font-black rounded-3xl',
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={!interactive && !onClick}
        className={cn(
          'relative flex items-center justify-center transition-all duration-300 select-none shadow-md',
          sizeClasses[size],
          info.badgeBg,
          rank === 'S'
            ? 'border-2 border-transparent bg-gradient-to-tr from-[#6600CC] via-[#A87FE8] to-[#C9A070] shadow-[0_0_20px_rgba(168,127,232,0.4)]'
            : `border ${info.badgeBorder}`,
          interactive && 'hover:scale-105 cursor-pointer',
          className
        )}
      >
        <span
          className={cn(
            'tracking-tight font-jost',
            rank === 'S'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F7F5FB] to-[#C9A070] drop-shadow-[0_2px_10px_rgba(168,127,232,0.8)]'
              : info.colorClass
          )}
        >
          {rank}
        </span>
        {rank === 'S' && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A070] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A87FE8]"></span>
          </span>
        )}
      </button>

      {showDetails && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wider text-[#A87FE8] font-semibold">
              Rang {rank}
            </span>
            <span className="text-xs text-white/40">•</span>
            <span className="text-xs text-white/90 font-medium">{info.chrisDoStage}</span>
          </div>
          <span className="text-[11px] text-[#A87FE8]/70 line-clamp-1">{info.subtitle}</span>
        </div>
      )}

      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 z-50 w-72 p-3.5 rounded-2xl bg-[#0D0A18]/95 border border-[#A87FE8]/30 shadow-2xl backdrop-blur-xl text-left pointer-events-none animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#6600CC]/30 border border-[#A87FE8]/40 text-xs font-bold text-[#A87FE8]">
                Rang {rank}
              </span>
              <span className="text-xs font-semibold text-white">{info.chrisDoStage}</span>
            </div>
            <span className="text-[10px] text-[#C9A070] uppercase font-semibold">Chris Do</span>
          </div>
          <p className="text-xs text-[#F7F5FB]/80 leading-relaxed">{info.criteria}</p>
        </div>
      )}
    </div>
  );
};
