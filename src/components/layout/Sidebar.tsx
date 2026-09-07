import React, { useState, useEffect } from 'react';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Repeat,
  Layers,
  Target,
  TrendingUp,
  Receipt,
  Users,
  Swords,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSystemData } from '../../context/SystemDataContext';
import { formatUSD } from '../../lib/utils';
import { calculateMilestones } from '../../lib/calculations';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  onExpandChange?: (expanded: boolean) => void;
}

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  isComingSoon?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage, onExpandChange }) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { objective, transactions } = useSystemData();

  const isExpanded = isPinned || isHovered;

  // Notify parent about expansion changes
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const milestone = objective
    ? calculateMilestones(transactions, objective.montant_cible, objective.date_cible)
    : null;

  const navItems: NavItem[] = [
    { id: 'status', label: 'Fenêtre de Statut', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'recurring', label: 'Charges récurrentes', icon: Repeat },
    { id: 'activities', label: 'Mes Activités', icon: Layers },
    { id: 'daily', label: 'Quête Quotidienne', icon: Target },
    { id: 'forecast', label: 'Prévisions', icon: TrendingUp },
    { id: 'portal', label: 'Portail', icon: Receipt, isComingSoon: true },
    { id: 'shadows', label: 'Armée des Ombres', icon: Users, isComingSoon: true },
    { id: 'dungeon', label: 'Donjon', icon: Swords, isComingSoon: true },
    { id: 'grimoire', label: 'Grimoire', icon: BookOpen, isComingSoon: true },
    { id: 'settings', label: 'Réglages', icon: Settings },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out',
        'bg-[#0D0A18]/95 backdrop-blur-2xl border-r border-[#A87FE8]/20 shadow-[8px_0_32px_rgba(13,10,24,0.5)]',
        isExpanded ? 'w-64' : 'w-[72px]',
        'hidden md:flex'
      )}
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10 shrink-0">
          <div
            onClick={() => onSelectPage('status')}
            className="flex items-center gap-3 cursor-pointer select-none overflow-hidden"
          >
            <div className="w-10 h-10 min-w-[40px] rounded-2xl bg-gradient-to-tr from-[#6600CC] to-[#A87FE8] flex items-center justify-center shadow-lg shadow-[#6600CC]/30 overflow-hidden p-2">
              <img
                src="/assets/class-s-icon.png"
                alt="Class S"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {isExpanded && (
              <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-200">
                <span className="font-extrabold text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F7F5FB] to-[#C9A070] font-jost">
                  LE SYSTÈME
                </span>
                <span className="text-[10px] text-[#A87FE8] font-bold tracking-widest uppercase">
                  Class S • Rang S
                </span>
              </div>
            )}
          </div>

          {isExpanded && (
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title={isPinned ? 'Désépingler' : 'Épingler'}
            >
              {isPinned ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-[#6600CC]/80 to-[#A87FE8]/40 text-white shadow-md border border-[#A87FE8]/40'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-xl transition-colors',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-[#A87FE8]/80 group-hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>

                {isExpanded && (
                  <div className="flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
                    <span className="text-sm font-medium tracking-tight truncate">{item.label}</span>
                    {item.isComingSoon && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C9A070]/20 text-[#C9A070] border border-[#C9A070]/30 font-semibold uppercase tracking-wider">
                        Bientôt
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip when collapsed */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#140F26] border border-[#A87FE8]/30 shadow-xl text-xs font-semibold text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                    {item.isComingSoon && (
                      <span className="ml-2 text-[9px] text-[#C9A070] uppercase">(Bientôt)</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dynamic Objective Progress Pill */}
      {isExpanded && objective && (
        <div className="p-4 m-3 rounded-2xl bg-[#6600CC]/20 border border-[#A87FE8]/30 backdrop-blur-md animate-in fade-in shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-white/70 font-medium">Objectif Rang S</span>
            <span className="text-[#C9A070] font-bold tabular-nums">
              {formatUSD(objective.montant_cible, 0)}
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6600CC] via-[#A87FE8] to-[#C9A070] h-full rounded-full transition-all duration-700"
              style={{ width: `${milestone?.percentage ?? 0}%` }}
            />
          </div>
          <p className="text-[10px] text-white/50 mt-1.5 truncate">
            Cible :{' '}
            {new Date(objective.date_cible + 'T12:00:00').toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      )}
    </aside>
  );
};
