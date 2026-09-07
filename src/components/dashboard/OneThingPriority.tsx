import React from 'react';
import { DailyTask, Activity } from '../../types';
import { FOCUSING_QUESTION } from '../../lib/constants';
import { GlassCard } from '../common/GlassCard';
import { Target, CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OneThingPriorityProps {
  tasks: DailyTask[];
  activities: Activity[];
  onToggleStatus: (taskId: string, currentStatus: DailyTask['statut']) => void;
  onNavigateToDaily: () => void;
  onOpenNewTask: () => void;
}

export const OneThingPriority: React.FC<OneThingPriorityProps> = ({
  tasks,
  activities,
  onToggleStatus,
  onNavigateToDaily,
  onOpenNewTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const priorityTask = todayTasks.find((t) => t.est_la_priorite);

  const linkedActivity = priorityTask?.activite_id
    ? activities.find((a) => a.id === priorityTask.activite_id)
    : null;

  return (
    <div className="flex flex-col gap-2">
      {/* Focusing Question Header */}
      <div className="flex items-center gap-2 px-1">
        <Target className="w-4 h-4 text-[#C9A070]" />
        <p className="text-xs italic text-[#C9A070]/90 font-medium">
          « {FOCUSING_QUESTION} »
        </p>
      </div>

      {priorityTask ? (
        <GlassCard className="p-5 border-[#C9A070]/40 bg-gradient-to-r from-[#1E1238]/80 to-[#140F26]/90 relative overflow-hidden group">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <button
                onClick={() =>
                  onToggleStatus(
                    priorityTask.id,
                    priorityTask.statut === 'terminee' ? 'a_faire' : 'terminee'
                  )
                }
                className="mt-0.5 text-[#C9A070] hover:scale-110 transition-transform"
                title={priorityTask.statut === 'terminee' ? 'Marquer à faire' : 'Marquer terminée'}
              >
                {priorityTask.statut === 'terminee' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#4ADE9A]" />
                ) : (
                  <Circle className="w-6 h-6 text-[#C9A070]" />
                )}
              </button>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C9A070]/20 text-[#C9A070] border border-[#C9A070]/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    LA Priorité du Jour
                  </span>
                  {linkedActivity && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      style={{
                        backgroundColor: `${linkedActivity.couleur}20`,
                        borderColor: `${linkedActivity.couleur}50`,
                        color: linkedActivity.couleur,
                      }}
                    >
                      {linkedActivity.nom}
                    </span>
                  )}
                </div>

                <h3
                  className={cn(
                    'text-base sm:text-lg font-bold text-white tracking-tight',
                    priorityTask.statut === 'terminee' && 'line-through text-white/50'
                  )}
                >
                  {priorityTask.titre}
                </h3>
                {priorityTask.note && (
                  <p className="text-xs text-white/60 mt-1 line-clamp-1">
                    {priorityTask.note}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onNavigateToDaily}
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span>Voir la quête</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-4 border-dashed border-[#A87FE8]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6600CC]/20 border border-[#A87FE8]/30 flex items-center justify-center text-[#A87FE8]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Aucune priorité définie pour aujourd'hui
              </p>
              <p className="text-xs text-white/50">
                Choisis LA quête non négociable pour avancer vers ton rang S.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNewTask}
            className="btn-cta px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-semibold whitespace-nowrap shadow-md"
          >
            + Définir LA priorité
          </button>
        </GlassCard>
      )}
    </div>
  );
};
