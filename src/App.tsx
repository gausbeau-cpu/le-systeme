import React, { useState, useCallback } from 'react';
import { ActivePage, Activity } from './types';
import { useAuth } from './context/AuthContext';
import { useSystemData } from './context/SystemDataContext';
import { calculateMilestones } from './lib/calculations';
import { DEFAULT_TARGET_USD, DEFAULT_TARGET_DATE } from './lib/constants';

// Layout & Common
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { LoginView } from './components/auth/LoginView';
import { OnboardingView } from './components/auth/OnboardingView';

// Views & Components
import { HeroProgress } from './components/dashboard/HeroProgress';
import { OneThingPriority } from './components/dashboard/OneThingPriority';
import { ActivityRankCards } from './components/dashboard/ActivityRankCards';
import { ProfitFirstRings } from './components/dashboard/ProfitFirstRings';
import { UpcomingExpenses } from './components/dashboard/UpcomingExpenses';

import { TransactionList } from './components/transactions/TransactionList';
import { TransactionFormModal } from './components/transactions/TransactionFormModal';

import { RecurringKPIs } from './components/recurring/RecurringKPIs';
import { RecurringCard } from './components/recurring/RecurringCard';
import { RecurringTimeline } from './components/recurring/RecurringTimeline';
import { RecurringFormModal } from './components/recurring/RecurringFormModal';

import { ActivityList } from './components/activities/ActivityList';
import { ActivityFormModal } from './components/activities/ActivityFormModal';
import { ActivityDetailModal } from './components/activities/ActivityDetailModal';

import { DailyQuestView } from './components/daily/DailyQuestView';
import { TaskFormModal } from './components/daily/TaskFormModal';

import { ForecastChart } from './components/forecast/ForecastChart';
import { ShowcasePage } from './components/showcase/ShowcasePage';
import { SettingsView } from './components/settings/SettingsView';

import { Plus } from 'lucide-react';

const SIDEBAR_COLLAPSED_PX = 72;
const SIDEBAR_EXPANDED_PX = 256;

export const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    activities,
    clients,
    transactions,
    recurringExpenses,
    dailyTasks,
    settings,
    objective,
    addClient,
    addActivity,
    updateActivity,
    updateActivityRank,
    addTransaction,
    deleteTransaction,
    addRecurringExpense,
    updateRecurringExpense,
    toggleRecurringExpenseStatus,
    deleteRecurringExpense,
    addDailyTask,
    setDailyPriority,
    updateDailyTaskStatus,
    deleteDailyTask,
  } = useSystemData();

  const [activePage, setActivePage] = useState<ActivePage>('status');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [isActModalOpen, setIsActModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedActivityForDetail, setSelectedActivityForDetail] = useState<Activity | null>(null);
  const [filterRecurringTab, setFilterRecurringTab] = useState<'all' | 'abonnement' | 'autres'>('all');
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleExpandChange = useCallback((expanded: boolean) => {
    setSidebarExpanded(expanded);
  }, []);

  const targetUSD = objective?.montant_cible ?? DEFAULT_TARGET_USD;
  const targetDateStr = objective?.date_cible ?? DEFAULT_TARGET_DATE;
  const milestones = calculateMilestones(transactions, targetUSD, targetDateStr);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0A18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6600CC] to-[#A87FE8] flex items-center justify-center animate-pulse p-2.5">
            <img
              src="/assets/class-s-icon.png"
              alt="Class S"
              className="w-full h-full object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <span className="text-xs font-bold text-[#A87FE8] uppercase tracking-widest">
            Chargement du Système...
          </span>
        </div>
      </div>
    );
  }

  // Non connecté -> Page de connexion
  if (!user) return <LoginView />;

  // Connecté sans objectif -> Écran d'onboarding
  if (!objective) return <OnboardingView />;

  const currentSidebarWidth = sidebarExpanded ? SIDEBAR_EXPANDED_PX : SIDEBAR_COLLAPSED_PX;

  return (
    <div className="min-h-screen bg-[#0D0A18] text-[#F7F5FB] font-jost">
      {/* Sidebar Desktop Fixe */}
      <Sidebar
        activePage={activePage}
        onSelectPage={setActivePage}
        onExpandChange={handleExpandChange}
      />

      {/* Contenu Principal — marge synchronisée avec l'état de la sidebar */}
      <div
        className="flex flex-col min-h-screen pb-20 md:pb-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${currentSidebarWidth}px` : undefined,
        }}
      >
        <Header
          activePage={activePage}
          onOpenNewTransaction={() => setIsTxModalOpen(true)}
          onSelectPage={setActivePage}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1440px] w-full mx-auto">
          {/* ================= 1. FENÊTRE DE STATUT (DASHBOARD) ================= */}
          {activePage === 'status' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <HeroProgress
                milestone={milestones}
                targetDateStr={targetDateStr}
                onOpenNewTransaction={() => setIsTxModalOpen(true)}
              />

              <OneThingPriority
                tasks={dailyTasks}
                activities={activities}
                onToggleStatus={(taskId, currentStat) =>
                  updateDailyTaskStatus(taskId, currentStat === 'terminee' ? 'a_faire' : 'terminee')
                }
                onNavigateToDaily={() => setActivePage('daily')}
                onOpenNewTask={() => setIsTaskModalOpen(true)}
              />

              <ActivityRankCards
                activities={activities}
                transactions={transactions}
                recurringExpenses={recurringExpenses}
                onSelectActivity={(act) => setSelectedActivityForDetail(act)}
                onOpenNewActivity={() => setIsActModalOpen(true)}
              />

              <ProfitFirstRings
                totalRevenueUSD={milestones.totalRevenueUSD}
                settings={settings.profit_first}
                recurringExpenses={recurringExpenses}
                onOpenSettings={() => setActivePage('settings')}
              />

              <UpcomingExpenses
                recurringExpenses={recurringExpenses}
                activities={activities}
                onNavigateToRecurring={() => setActivePage('recurring')}
                onOpenNewRecurring={() => setIsRecModalOpen(true)}
              />
            </div>
          )}

          {/* ================= 2. TRANSACTIONS ================= */}
          {activePage === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Flux de Trésorerie
                  </h2>
                  <p className="text-xs text-white/50">
                    Chaque revenu en USD ou XOF converti instantanément
                  </p>
                </div>
                <button
                  onClick={() => setIsTxModalOpen(true)}
                  className="btn-cta px-4 py-2 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Transaction</span>
                </button>
              </div>

              <TransactionList
                transactions={transactions}
                activities={activities}
                clients={clients}
                onDeleteTransaction={deleteTransaction}
                onOpenNewTransaction={() => setIsTxModalOpen(true)}
              />
            </div>
          )}

          {/* ================= 3. CHARGES RÉCURRENTES ================= */}
          {activePage === 'recurring' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <RecurringKPIs
                recurringExpenses={recurringExpenses}
                activities={activities}
              />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
                  {(['all', 'abonnement', 'autres'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterRecurringTab(tab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        filterRecurringTab === tab
                          ? 'bg-[#6600CC] text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {tab === 'all'
                        ? `Tout (${recurringExpenses.length})`
                        : tab === 'abonnement'
                        ? 'Abonnements Logiciels'
                        : 'Autres Charges Fixes'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsRecModalOpen(true)}
                  className="btn-cta px-4 py-2 rounded-xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une charge</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recurringExpenses
                  .filter((e) => {
                    if (filterRecurringTab === 'abonnement') return e.nature === 'abonnement';
                    if (filterRecurringTab === 'autres') return e.nature !== 'abonnement';
                    return true;
                  })
                  .map((exp) => (
                    <RecurringCard
                      key={exp.id}
                      expense={exp}
                      activity={activities.find((a) => a.id === exp.activite_id)}
                      onToggleStatus={toggleRecurringExpenseStatus}
                      onDelete={deleteRecurringExpense}
                    />
                  ))}
              </div>

              <RecurringTimeline
                recurringExpenses={recurringExpenses}
                activities={activities}
              />
            </div>
          )}

          {/* ================= 4. MES ACTIVITÉS ================= */}
          {activePage === 'activities' && (
            <ActivityList
              activities={activities}
              transactions={transactions}
              recurringExpenses={recurringExpenses}
              onAddActivity={addActivity}
              onUpdateActivity={updateActivity}
              onUpdateRank={updateActivityRank}
            />
          )}

          {/* ================= 5. QUÊTE QUOTIDIENNE ================= */}
          {activePage === 'daily' && (
            <DailyQuestView
              tasks={dailyTasks}
              activities={activities}
              onAddTask={addDailyTask}
              onSetPriority={setDailyPriority}
              onUpdateStatus={updateDailyTaskStatus}
              onDeleteTask={deleteDailyTask}
            />
          )}

          {/* ================= 6. PRÉVISIONS ================= */}
          {activePage === 'forecast' && (
            <ForecastChart
              transactions={transactions}
              targetUSD={targetUSD}
              targetDateStr={targetDateStr}
              onOpenNewTransaction={() => setIsTxModalOpen(true)}
            />
          )}

          {/* ================= VITRINES ================= */}
          {activePage === 'portal' && <ShowcasePage page="portal" />}
          {activePage === 'shadows' && <ShowcasePage page="shadows" />}
          {activePage === 'dungeon' && <ShowcasePage page="dungeon" />}
          {activePage === 'grimoire' && <ShowcasePage page="grimoire" />}

          {/* ================= RÉGLAGES ================= */}
          {activePage === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activePage={activePage}
        onSelectPage={(p) => {
          setActivePage(p);
          setIsMobileMoreOpen(false);
        }}
        onOpenMore={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
      />

      {/* Mobile More Drawer */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0D0A18]/90 backdrop-blur-xl p-6 flex flex-col justify-between animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Autres Modules</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'forecast', label: 'Prévisions' },
                { id: 'portal', label: 'Portail (Bientôt)' },
                { id: 'shadows', label: 'Armée des Ombres (Bientôt)' },
                { id: 'dungeon', label: 'Donjon (Bientôt)' },
                { id: 'grimoire', label: 'Grimoire (Bientôt)' },
                { id: 'settings', label: 'Réglages' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActivePage(m.id as ActivePage);
                    setIsMobileMoreOpen(false);
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs font-bold text-white hover:bg-[#6600CC]/30"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsMobileMoreOpen(false)}
            className="w-full py-3 rounded-2xl bg-white/10 text-white text-xs font-bold"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Modals Globales */}
      <TransactionFormModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        activities={activities}
        clients={clients}
        onAddTransaction={addTransaction}
        onAddActivity={addActivity}
        onAddClient={addClient}
      />

      <RecurringFormModal
        isOpen={isRecModalOpen}
        onClose={() => setIsRecModalOpen(false)}
        activities={activities}
        onAddRecurringExpense={addRecurringExpense}
      />

      <ActivityFormModal
        isOpen={isActModalOpen}
        onClose={() => setIsActModalOpen(false)}
        onSave={addActivity}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        activities={activities}
        onAddTask={addDailyTask}
        isPriorityDefault={true}
      />

      <ActivityDetailModal
        activity={selectedActivityForDetail}
        isOpen={!!selectedActivityForDetail}
        onClose={() => setSelectedActivityForDetail(null)}
        transactions={transactions}
        recurringExpenses={recurringExpenses}
        onUpdateRank={updateActivityRank}
        onOpenEditActivity={() => {
          setSelectedActivityForDetail(null);
        }}
      />
    </div>
  );
};

export default App;
