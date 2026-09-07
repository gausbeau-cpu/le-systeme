import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-[#A87FE8]/20 bg-[#140F26]/30',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6600CC]/30 to-[#A87FE8]/20 border border-[#A87FE8]/30 flex items-center justify-center mb-4 text-[#A87FE8] shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5 font-jost">{title}</h3>
      <p className="text-sm text-white/60 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-cta px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-sm font-semibold shadow-lg shadow-[#6600CC]/30 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
