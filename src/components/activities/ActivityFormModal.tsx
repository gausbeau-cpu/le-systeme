import React, { useState, useEffect } from 'react';
import { Activity, HunterRank } from '../../types';
import { Modal } from '../common/Modal';
import { ACTIVITY_COLORS, HUNTER_RANKS } from '../../lib/constants';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: Activity | null;
  onSave: (activity: Omit<Activity, 'id' | 'uid' | 'date_creation'>) => Promise<Activity | void>;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  activityToEdit,
  onSave,
}) => {
  const [nom, setNom] = useState('');
  const [couleur, setCouleur] = useState(ACTIVITY_COLORS[0]);
  const [rangActuel, setRangActuel] = useState<HunterRank>('E');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activityToEdit) {
      setNom(activityToEdit.nom);
      setCouleur(activityToEdit.couleur);
      setRangActuel(activityToEdit.rang_actuel);
    } else {
      setNom('');
      setCouleur(ACTIVITY_COLORS[Math.floor(Math.random() * ACTIVITY_COLORS.length)]);
      setRangActuel('E');
    }
    setErrorMsg(null);
  }, [activityToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setErrorMsg('Veuillez entrer un nom pour cette activité.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        nom: nom.trim(),
        couleur,
        icone: 'Sparkles',
        statut: 'active',
        rang_actuel: rangActuel,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityToEdit ? "Modifier l'activité" : "Créer une Activité Économique"}
      subtitle="Chaque activité est une branche de valeur vers ton rang S"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Nom */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">
            Nom de l'activité *
          </label>
          <input
            type="text"
            required
            placeholder="ex: Direction Artistique, Identité Visuelle, UI/UX..."
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0A18]/80 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A87FE8]"
          />
        </div>

        {/* Couleur Signature */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">
            Couleur Signature
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {ACTIVITY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCouleur(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  couleur === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0D0A18]' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Rang Initial (E par défaut) */}
        {!activityToEdit && (
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Rang de départ (Framework Chris Do)
            </label>
            <select
              value={rangActuel}
              onChange={(e) => setRangActuel(e.target.value as HunterRank)}
              className="w-full px-3 py-2 rounded-xl bg-[#0D0A18]/80 border border-white/15 text-white text-xs focus:outline-none focus:border-[#A87FE8]"
            >
              {(['E', 'D', 'C', 'B', 'A', 'S'] as HunterRank[]).map((r) => (
                <option key={r} value={r} className="bg-[#140F26]">
                  Rang {r} — {HUNTER_RANKS[r].chrisDoStage} ({HUNTER_RANKS[r].subtitle})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action buttons */}
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
            <span>{activityToEdit ? 'Enregistrer les modifications' : 'Créer l\'activité'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
