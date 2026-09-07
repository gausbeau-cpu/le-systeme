import React, { useState } from 'react';
import { ActivePage } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { useSystemData } from '../../context/SystemDataContext';
import {
  Receipt,
  Users,
  Swords,
  BookOpen,
  Sparkles,
  Bell,
  CheckCircle2,
  Share2,
  Clock,
  Kanban,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShowcasePageProps {
  page: 'portal' | 'shadows' | 'dungeon' | 'grimoire';
}

export const ShowcasePage: React.FC<ShowcasePageProps> = ({ page }) => {
  const { settings, registerShowcaseInterest } = useSystemData();
  const [hasNotified, setHasNotified] = useState(
    settings.showcase_interests?.includes(page) || false
  );

  const handleNotify = async () => {
    await registerShowcaseInterest(page);
    setHasNotified(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6600CC', '#A87FE8', '#C9A070'],
    });
  };

  const configs = {
    portal: {
      title: 'Portail',
      badge: 'Facturation & Paiements',
      icon: Receipt,
      description:
        "Ouvre un portail vers chaque mission : devis, facture, suivi de paiement et relance, sans ressaisie — chaque facture payée alimente automatiquement ta Fenêtre de Statut. Facture et paiement restent toujours deux entités distinctes : une facture peut être réglée en plusieurs fois, chaque paiement est tracé individuellement.",
      formHighlight:
        "Partage un simple lien de formulaire à ton client — dès qu'il le remplit, un nouveau dossier s'ouvre automatiquement dans ton Donjon, brief inclus, sans ressaisie de ta part.",
    },
    shadows: {
      title: 'Armée des Ombres',
      badge: 'CRM & Relations Clients',
      icon: Users,
      description:
        "Chaque client conquis rejoint ton armée. Suis ton pipeline, l'historique de chaque relation, et la valeur de vie de chaque ombre recrutée.",
      formHighlight:
        "L'entité Client est déjà active dans ton socle de données actuel : chaque client associé à tes transactions sera automatiquement rattaché à son historique d'armée dès l'activation du module.",
    },
    dungeon: {
      title: 'Donjon',
      badge: 'Commandes & Projets',
      icon: Swords,
      description:
        "Chaque commande devient un donjon à traverser étage par étage : brief, direction artistique, révisions, validation, livraison. Suis le temps passé, les fichiers et l'avancement de chaque mission, sans jamais perdre le fil.",
      formHighlight:
        "Une commande validée génère automatiquement sa progression par étages et déclenche les alertes de temps estimé vs temps réel.",
    },
    grimoire: {
      title: 'Grimoire',
      badge: 'Catalogue & Rentabilité',
      icon: BookOpen,
      description:
        "Ton grimoire de techniques : chaque prestation que tu maîtrises, avec son prix, sa marge réelle et le nombre de fois où elle t'a rapporté. De quoi savoir enfin quelles techniques valent la peine d'être répétées.",
      formHighlight:
        "Compare objectivement la rentabilité de tes prestations de design pour doubler la cadence sur celles qui maximisent ta marge horaire.",
    },
  };

  const current = configs[page];
  const Icon = current.icon;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Hero Showcase Card */}
      <GlassCard className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-[#1E113A]/90 via-[#140F26]/95 to-[#0D0A18]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6600CC]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Badge Bientôt Disponible */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6600CC]/30 border border-[#A87FE8]/40 mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A070]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#A87FE8]">
              Bientôt Disponible • Module en Vitrine
            </span>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#6600CC] to-[#A87FE8] flex items-center justify-center text-white mb-4 shadow-xl shadow-[#6600CC]/40 p-4">
            <Icon className="w-full h-full" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-jost">
            {current.title}
          </h1>
          <span className="text-sm font-semibold text-[#C9A070] mt-1 uppercase tracking-wider">
            {current.badge}
          </span>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed mt-4 font-normal">
            {current.description}
          </p>

          {current.formHighlight && (
            <div className="mt-5 p-4 rounded-2xl bg-[#6600CC]/20 border border-[#A87FE8]/30 text-xs text-white/90 text-left flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#C9A070] shrink-0 mt-0.5" />
              <span>{current.formHighlight}</span>
            </div>
          )}

          {/* Notify CTA */}
          <div className="mt-8">
            <button
              onClick={handleNotify}
              disabled={hasNotified}
              className={`btn-cta px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-xl transition-all flex items-center gap-2.5 ${
                hasNotified
                  ? 'bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-[#6600CC] via-[#A87FE8] to-[#C9A070] text-white shadow-[#6600CC]/40 hover:opacity-95'
              }`}
            >
              {hasNotified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tu seras prévenu dès le déploiement !</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Me prévenir au lancement de {current.title}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Mockup Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-jost">
            Aperçu de l'interface future
          </span>
          <span className="text-[11px] text-white/40 italic">
            Mockup architectural — connectivité native avec le socle Class S
          </span>
        </div>

        {/* Portal Preview */}
        {page === 'portal' && (
          <GlassCard className="p-6 border-white/10 opacity-70 hover:opacity-100 transition-opacity">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-white">Lien Formulaire Client Partagé</span>
                </div>
                <span className="text-[10px] text-[#C9A070] bg-[#C9A070]/10 px-2 py-0.5 rounded-full">
                  Auto-sync vers Donjon activé
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {['Brouillon', 'Envoyée', 'Partiellement payée (Acompte)', 'Payée (Soldée)'].map(
                  (status, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-[10px] font-bold text-[#A87FE8] uppercase">{status}</span>
                      <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  )
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Shadows CRM Preview */}
        {page === 'shadows' && (
          <GlassCard className="p-6 border-white/10 opacity-70 hover:opacity-100 transition-opacity">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {['Prospect', 'Discussion', 'Devis envoyé', 'Client Actif', 'Ombre Fidélisée'].map(
                (col, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-[11px] font-bold text-white block pb-1 border-b border-white/10">
                      {col}
                    </span>
                    <div className="p-3 rounded-xl bg-[#0D0A18]/60 border border-white/10 space-y-2">
                      <div className="h-3 bg-white/15 rounded w-2/3" />
                      <div className="h-2 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                )
              )}
            </div>
          </GlassCard>
        )}

        {/* Dungeon Project Preview */}
        {page === 'dungeon' && (
          <GlassCard className="p-6 border-white/10 opacity-70 hover:opacity-100 transition-opacity">
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block mb-2">
                Progression Verticale par Étages de Donjon
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[
                  'Étage 1 : Brief & Formulaire',
                  'Étage 2 : Direction Artistique',
                  'Étage 3 : Révisions (Max 2)',
                  'Étage 4 : Validation Client',
                  'Étage 5 : Livraison & Trésor',
                ].map((floor, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between h-28"
                  >
                    <span className="text-[10px] font-bold text-[#A87FE8] uppercase">{floor}</span>
                    <div className="flex items-center gap-1 text-[10px] text-white/40">
                      <Clock className="w-3 h-3" />
                      <span>0h / 12h estimé</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Grimoire Catalog Preview */}
        {page === 'grimoire' && (
          <GlassCard className="p-6 border-white/10 opacity-70 hover:opacity-100 transition-opacity">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Technique : Identité Visuelle S', 'Technique : Direction Artistique 3D', 'Technique : Système Design UI/UX'].map(
                (tech, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white block">{tech}</span>
                    <div className="flex items-center justify-between text-[11px] text-white/50">
                      <span>Marge cible</span>
                      <span className="text-[#4ADE9A] font-bold">85%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#4ADE9A] h-full w-4/5 rounded-full" />
                    </div>
                  </div>
                )
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
