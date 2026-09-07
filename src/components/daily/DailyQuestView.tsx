import React, { useState } from 'react';
import { DailyTask, Activity } from '../../types';
import { FOCUSING_QUESTION } from '../../lib/constants';
import { GlassCard } from '../common/GlassCard';
import { formatDateFr } from '../../lib/utils';
import {
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Star,
  Check,
} from 'lucide-react';
import { TaskFormModal } from './TaskFormModal';
import { cn } from '../../lib/utils';

interface DailyQuestViewProps {
  tasks: DailyTask[];
  activities: Activity[];
  onAddTask: (task: Omit<DailyTask, 'id' | 'uid'>) => Promise<DailyTask>;
  onSetPriority: (taskId: string, date: string) => Promise<void>;
  onUpdateStatus: (taskId: string, statut: DailyTask['statut']) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export const DailyQuestView: React.FC<DailyQuestViewProps> = ({
  tasks,
  activities,
  onAddTask,
  onSetPriority,
  onUpdateStatus,
  onDeleteTask,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate 7 days for the weekly mini-calendar (current week centered or starting Monday)
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(today);
    // Find current Monday
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + idx;
    d.setDate(diff);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d);
    const dayNum = d.getDate();

    // Check if priority task for this date was completed
    const datePriority = tasks.find((t) => t.date === dateStr && t.est_la_priorite);
    const isCompleted = datePriority?.statut === 'terminee';
    const isToday = dateStr === new Date().toISOString().split('T')[0];

    return {
      dateStr,
      dayName,
      dayNum,
      isToday,
      hasPriority: !!datePriority,
      isCompleted,
    };
  });

  const currentDayTasks = tasks.filter((t) => t.date === selectedDate);
  const priorityTask = currentDayTasks.find((t) => t.est_la_priorite);
  const otherTasks = currentDayTasks.filter((t) => !t.est_la_priorite);

  return (
    <div className="space-y-6">
      {/* Focusing Question Header Card */}
      <GlassCard className="p-6 bg-gradient-to-r from-[#1F1238] via-[#140F26] to-[#120B24] border-[#C9A070]/40 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A070]/20 border border-[#C9A070]/40 flex items-center justify-center text-[#C9A070] shrink-0 mt-1">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#C9A070] font-bold">
              The One Thing • Principe Gary Keller
            </span>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight italic mt-1 font-jost">
              « {FOCUSING_QUESTION} »
            </h2>
            <p className="text-xs text-white/50 mt-1.5">
              Chaque jour n'a qu'un seul objectif capital. Tant que LA priorité n'est pas traitée, tout le reste est secondaire.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 7-Days Weekly Mini-Calendar */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A87FE8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Constance Hebdomadaire sur LA Priorité
            </span>
          </div>
          <span className="text-xs text-white/50">
            Jour sélectionné : {formatDateFr(selectedDate)}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={cn(
                  'p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center transition-all border text-center',
                  isSelected
                    ? 'bg-[#6600CC]/80 border-[#A87FE8] text-white shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70',
                  day.isToday && !isSelected && 'border-[#C9A070]/50'
                )}
              >
                <span className="text-[10px] uppercase font-bold">{day.dayName}</span>
                <span className="text-sm sm:text-base font-extrabold tabular-nums my-0.5">
                  {day.dayNum}
                </span>

                {/* Completion indicator */}
                <div className="mt-1">
                  {day.hasPriority ? (
                    day.isCompleted ? (
                      <span className="w-2 h-2 rounded-full bg-[#4ADE9A] inline-block shadow-[0_0_8px_#4ADE9A]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#C9A070] inline-block" />
                    )
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* LA Priorité du Jour Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A070]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A070] font-jost">
              LA Priorité du Jour (Unique & Non Négociable)
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-cta px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une quête</span>
          </button>
        </div>

        {priorityTask ? (
          <GlassCard className="p-6 border-[#C9A070]/50 bg-gradient-to-r from-[#20133A]/90 to-[#140F26]/90 shadow-xl group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() =>
                    onUpdateStatus(
                      priorityTask.id,
                      priorityTask.statut === 'terminee' ? 'a_faire' : 'terminee'
                    )
                  }
                  className="mt-1 text-[#C9A070] hover:scale-110 transition-transform"
                >
                  {priorityTask.statut === 'terminee' ? (
                    <CheckCircle2 className="w-7 h-7 text-[#4ADE9A]" />
                  ) : (
                    <Circle className="w-7 h-7 text-[#C9A070]" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C9A070]/20 text-[#C9A070] border border-[#C9A070]/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#C9A070]" />
                      LA Chose Ultime
                    </span>
                    {priorityTask.activite_id && (
                      <span className="text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded-full">
                        {activities.find((a) => a.id === priorityTask.activite_id)?.nom}
                      </span>
                    )}
                  </div>

                  <h3
                    className={cn(
                      'text-lg sm:text-xl font-bold text-white tracking-tight',
                      priorityTask.statut === 'terminee' && 'line-through text-white/50'
                    )}
                  >
                    {priorityTask.titre}
                  </h3>

                  {priorityTask.note && (
                    <p className="text-xs text-white/70 mt-1.5">{priorityTask.note}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(priorityTask.id)}
                className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 border-dashed border-[#C9A070]/40 text-center flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-white mb-1">
              Définis LA chose que tu vas faire aujourd'hui.
            </p>
            <p className="text-xs text-white/50 max-w-sm mb-4">
              Choisis l'action décisive qui propulse Scott Nana vers le rang S.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-cta px-4 py-2 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-bold shadow-md"
            >
              + Définir LA priorité
            </button>
          </GlassCard>
        )}
      </div>

      {/* Autres Tâches Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 font-jost">
          Autres tâches (à ne traiter qu'après LA priorité)
        </h3>

        {otherTasks.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            Aucune tâche secondaire pour cette date.
          </p>
        ) : (
          <div className="space-y-2">
            {otherTasks.map((t) => {
              const act = activities.find((a) => a.id === t.activite_id);
              const isDone = t.statut === 'terminee';

              return (
                <GlassCard
                  key={t.id}
                  className="p-4 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        onUpdateStatus(t.id, isDone ? 'a_faire' : 'terminee')
                      }
                      className="text-white/40 hover:text-white"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#4ADE9A]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium text-white',
                            isDone && 'line-through text-white/50'
                          )}
                        >
                          {t.titre}
                        </span>
                        {act && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              backgroundColor: `${act.couleur}20`,
                              color: act.couleur,
                            }}
                          >
                            {act.nom}
                          </span>
                        )}
                      </div>
                      {t.note && (
                        <span className="text-[11px] text-white/50 block mt-0.5">
                          {t.note}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Make this task the Priority */}
                    <button
                      onClick={() => onSetPriority(t.id, selectedDate)}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold text-[#C9A070] bg-[#C9A070]/10 hover:bg-[#C9A070]/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="Promouvoir en priorité du jour"
                    >
                      Définir comme priorité
                    </button>

                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1 text-white/30 hover:text-rose-400 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activities={activities}
        onAddTask={onAddTask}
        defaultDate={selectedDate}
        isPriorityDefault={!priorityTask}
      />
    </div>
  );
};
