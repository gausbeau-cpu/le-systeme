import React from 'react';
import { SyncState } from '../../types';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SyncIndicatorProps {
  state: SyncState;
  errorMessage?: string | null;
  onRetry?: () => void;
  className?: string;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  state,
  errorMessage,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-300',
        state === 'synced' && 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
        state === 'syncing' && 'bg-[#C9A070]/15 border-[#C9A070]/40 text-[#C9A070]',
        state === 'error' && 'bg-rose-950/40 border-rose-500/40 text-rose-300 cursor-pointer',
        state === 'offline' && 'bg-amber-950/40 border-amber-500/30 text-amber-300',
        className
      )}
      onClick={state === 'error' ? onRetry : undefined}
      title={errorMessage || undefined}
    >
      {state === 'synced' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="hidden sm:inline">Synchronisé</span>
        </>
      )}

      {state === 'syncing' && (
        <>
          <RefreshCw className="w-3 h-3 animate-spin text-[#C9A070]" />
          <span>Synchronisation...</span>
        </>
      )}

      {state === 'error' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="truncate max-w-[140px]">
            {errorMessage || 'Erreur — réessai'}
          </span>
        </>
      )}

      {state === 'offline' && (
        <>
          <CloudOff className="w-3 h-3 text-amber-400" />
          <span className="hidden sm:inline">Hors-ligne (Local)</span>
        </>
      )}
    </div>
  );
};
