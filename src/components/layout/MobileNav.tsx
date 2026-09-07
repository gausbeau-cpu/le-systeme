import React from 'react';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Repeat,
  Layers,
  Target,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activePage,
  onSelectPage,
  onOpenMore,
}) => {
  const mainTabs: { id: ActivePage; label: string; icon: React.ElementType }[] = [
    { id: 'status', label: 'Statut', icon: LayoutDashboard },
    { id: 'transactions', label: 'Flux', icon: ArrowLeftRight },
    { id: 'recurring', label: 'Charges', icon: Repeat },
    { id: 'activities', label: 'Activités', icon: Layers },
    { id: 'daily', label: 'Quête', icon: Target },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0A18]/95 backdrop-blur-2xl border-t border-[#A87FE8]/20 px-2 py-2 flex items-center justify-around">
      {mainTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectPage(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all',
              isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
            )}
          >
            <div
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                isActive ? 'bg-[#6600CC] text-white shadow-md' : 'text-inherit'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* More items (Forecasts, Showcases, Settings) */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-white/50 hover:text-white transition-all"
      >
        <div className="p-1.5 rounded-lg text-inherit">
          <MoreHorizontal className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-medium tracking-tight">Plus</span>
      </button>
    </nav>
  );
};
