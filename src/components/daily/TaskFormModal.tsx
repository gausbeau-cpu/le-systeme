import React, { useState } from 'react';
import { Activity, DailyTask } from '../../types';
import { Modal } from '../common/Modal';
import { Check, Target, AlertCircle, Sparkles } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onAddTask: (task: Omit<DailyTask, 'id' | 'uid'>) => Promise<DailyTask>;
  defaultDate?: string;
  isPriorityDefault?: boolean;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  activities,
  onAddTask,
  defaultDate,
  isPriorityDefault = false,
}) => {
  const [titre, setTitre] = useState('');
  const [activiteId, setActiviteId] = useState('');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [estLaPriorite, setEstLaPriorite] = useState(isPriorityDefault);
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) {
      setErrorMsg('Veuillez entrer un titre pour la quête.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTask({
        titre: titre.trim(),
        activite_id: activiteId || undefined,
        date,
        est_la_priorite: estLaPriorite,
        statut: 'a_faire',
        note: note.trim() || undefined,
      });
      onClose();
      // Reset
      setTitre('');
      setNote('');
      setEstLaPriorite(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter une Quête Quotidienne"
      subtitle="The One Thing • Concentre ton énergie sur l'essentiel"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Priority Toggle Callout */}
        <div
          onClick={() => setEstLaPriorite(!estLaPriorite)}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
            estLaPriorite
              ? 'bg-[#C9A070]/20 border-[#C9A070] text-[#C9A070]'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#C9A070]" />
            <div>
              <span className="text-xs font-bold block text-white">
                Désigner comme « LA Priorité du Jour »
              </span>
              <span className="text-[11px] text-white/50 block">
                Une seule tâche par jour peut porter ce statut (règle The One Thing).
              </span>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
              estLaPriorite ? 'bg-[#C9A070] border-[#C9A070] text-black' : 'border-white/30'
            }`}
          >
            {estLaPriorite && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Titre */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">
            Intitulé de la quête *
          </label>
          <input
            type="text"
            required
            placeholder="ex: Livrer la proposition de DA pour Client Alpha"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0A18]/80 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A87FE8]"
          />
        </div>

        {/* Activité liée & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Activité liée (Optionnel)
            </label>
            <select
              value={activiteId}
              onChange={(e) => setActiviteId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0D0A18]/80 border border-white/15 text-white text-xs focus:outline-none focus:border-[#A87FE8]"
            >
              <option value="" className="bg-[#140F26] text-white/40">
                -- Non liée --
              </option>
              {activities.map((a) => (
                <option key={a.id} value={a.id} className="bg-[#140F26]">
                  {a.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0D0A18]/80 border border-white/15 text-white text-xs focus:outline-none focus:border-[#A87FE8]"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">
            Notes / Consignes (Optionnel)
          </label>
          <input
            type="text"
            placeholder="Détails complémentaires..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0D0A18]/80 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#A87FE8]"
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cta px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-bold shadow-lg shadow-[#6600CC]/30 hover:opacity-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Ajouter la quête</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
