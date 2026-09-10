'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Compass, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Feather, 
  ShieldAlert, 
  Zap, 
  Star, 
  Crown,
  Heart,
  RefreshCw,
  TrendingUp,
  Filter,
  Check,
  MessageSquare
} from 'lucide-react';
import { UserMetrics, ExamNotice, MascotId, MascotCompanion, Achievement, DailyMission } from '@/lib/types';
import { MASCOTS_DATA, INITIAL_ACHIEVEMENTS, INITIAL_DAILY_MISSIONS } from '@/lib/mockData';
import { MascotChatModal } from './MascotChatModal';
import confetti from 'canvas-confetti';

interface StudentAchievementsProps {
  metrics: UserMetrics;
  selectedExam: ExamNotice;
  onGoToSimulator: (subjectId?: string) => void;
  onGoToTab?: (tab: string) => void;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({
  metrics,
  selectedExam,
  onGoToSimulator,
  onGoToTab
}) => {
  // Mascote selecionado
  const [selectedMascotId, setSelectedMascotId] = useState<MascotId>('coruja');
  const [isMascotSelectorOpen, setIsMascotSelectorOpen] = useState(false);
  
  // Gamificação / XP e Nível
  const [userXp, setUserXp] = useState(2450);
  const [userLevel, setUserLevel] = useState(4);
  const nextLevelXp = 3000;
  const currentLevelBaseXp = 2000;
  const xpProgressPercent = Math.round(((userXp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100);

  // Missões Diárias
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_DAILY_MISSIONS);

  // Conquistas & Filtro
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const currentMascot = MASCOTS_DATA.find((m) => m.id === selectedMascotId) || MASCOTS_DATA[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Completar missão com confete e XP
  const handleCompleteMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId && !m.completed) {
          const addedXp = m.xpReward;
          setUserXp((x) => x + addedXp);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
          showToast(`Missão Concluída! +${addedXp} XP para ${currentMascot.name}`);
          return { ...m, completed: true, current: m.target };
        }
        return m;
      })
    );
  };

  // Filtro de conquistas
  const filteredAchievements = selectedCategory === 'todas'
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const getTierBadge = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'diamond':
        return 'border-cyan-400/50 bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30';
      case 'gold':
        return 'border-amber-400/50 bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30';
      case 'silver':
        return 'border-slate-300/50 bg-slate-400/15 text-slate-200 ring-1 ring-slate-300/30';
      case 'bronze':
      default:
        return 'border-amber-700/50 bg-amber-800/15 text-amber-500 ring-1 ring-amber-700/30';
    }
  };

  // Cálculo da distância para a nota de corte
  const distanceToCutoff = Math.max(0, +(metrics.estimatedCutoffScore - metrics.probabilityOfPassing).toFixed(1));
  const isAboveCutoff = metrics.probabilityOfPassing >= metrics.estimatedCutoffScore;

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold shadow-2xl shadow-indigo-600/40 border border-amber-300/40 animate-fadeIn flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO DO COMPANHEIRO ANIMAL & DIALOGO ACOLHEDOR */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 glow-brand relative overflow-hidden">
        {/* Background glow decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar Animal & Nível */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-1 shadow-xl shadow-indigo-600/30 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => setIsMascotSelectorOpen(!isMascotSelectorOpen)}
                title="Clique para escolher seu Mascote Companheiro"
              >
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
                  {currentMascot.avatarEmoji}
                </div>
              </div>
              <button 
                onClick={() => setIsMascotSelectorOpen(!isMascotSelectorOpen)}
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-800 border border-white/20 text-[10px] font-bold text-amber-300 shadow-md hover:bg-slate-700 transition-colors"
              >
                Trocar
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NÍVEL {userLevel} • {currentMascot.species.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-400">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  {metrics.streakDays} dias de streak
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {currentMascot.name} <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">({currentMascot.title})</span>
              </h2>

              {/* Barra de XP */}
              <div className="mt-2 w-56 sm:w-72">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>{userXp} XP</span>
                  <span className="text-indigo-400">Próx. Nível: {nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-dark-surface rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-300 dark:border-white/10">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Balão de Fala Acolhedor do Mascote (Foco sem Pânico) */}
          <div className="w-full lg:max-w-md p-4 sm:p-5 rounded-2xl bg-indigo-500/10 dark:bg-dark-card/90 border border-indigo-400/30 relative">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  Direção do Dia • Sem Ansiedade
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{currentMascot.dailyAdvice}"
                </p>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-indigo-400/20 pt-2.5">
                  <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">✨ {currentMascot.encouragement}</span>
                  <button
                    onClick={() => setIsChatModalOpen(true)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/30 active:scale-95"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Conversar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Seletor Rápido de Mascotes (Gaveta / Dropdown) */}
        {isMascotSelectorOpen && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Escolha seu Companheiro Animal de Estudos:
              </span>
              <button 
                onClick={() => setIsMascotSelectorOpen(false)}
                className="text-xs text-indigo-400 hover:underline font-bold"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MASCOTS_DATA.map((mascot) => (
                <div
                  key={mascot.id}
                  onClick={() => {
                    setSelectedMascotId(mascot.id);
                    setIsMascotSelectorOpen(false);
                    showToast(`Companheiro alterado: ${mascot.name} (${mascot.species})`);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    selectedMascotId === mascot.id
                      ? 'border-indigo-500 bg-indigo-500/20 ring-2 ring-indigo-400/40'
                      : 'border-slate-200 dark:border-white/5 hover:border-indigo-400/30 bg-slate-50 dark:bg-dark-surface'
                  }`}
                >
                  <div className="text-3xl p-2 rounded-xl bg-slate-900/50 shrink-0">
                    {mascot.avatarEmoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{mascot.name}</h4>
                      {selectedMascotId === mascot.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{mascot.species}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 truncate">{mascot.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 2. O TERMÔMETRO DA NOTA DE CORTE ("COMO EU ESTOU HOJE?") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card do Termômetro */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Termômetro de Aptidão para Nota de Corte
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Concurso Alvo: <strong className="text-slate-800 dark:text-slate-200">{selectedExam.title}</strong>
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                isAboveCutoff 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isAboveCutoff ? '✓ ZONA DE CLASSIFICAÇÃO' : '⚡ DISPUTANDO CADASTRO'}
              </span>
            </div>

            {/* Barra Comparativa do Termômetro */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Seu Rendimento Preditivo Atual:
                </span>
                <span className="text-xl font-black text-indigo-400">{metrics.probabilityOfPassing}%</span>
              </div>

              {/* Barra de Progresso com Marcador de Corte */}
              <div className="relative w-full bg-slate-200 dark:bg-dark-surface rounded-2xl h-5 p-1 border border-slate-300 dark:border-white/10">
                <div 
                  className="h-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700 shadow-sm"
                  style={{ width: `${metrics.probabilityOfPassing}%` }}
                />

                {/* Marcador da Nota de Corte */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 flex flex-col items-center"
                  style={{ left: `${metrics.estimatedCutoffScore}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 -mt-1 shadow" />
                  <span className="absolute -top-7 text-[10px] font-black text-rose-400 whitespace-nowrap bg-rose-950/90 px-1.5 py-0.5 rounded border border-rose-500/40">
                    Corte: {metrics.estimatedCutoffScore}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>0% (Início da Preparação)</span>
                <span className="text-rose-400 font-bold">Ponto de Corte Estimado: {metrics.estimatedCutoffScore}%</span>
                <span>100% (Gabarito Completo)</span>
              </div>
            </div>

            {/* Diagnóstico em Linguagem Humana */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-100 dark:bg-dark-surface/60 border border-slate-200 dark:border-white/5">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isAboveCutoff ? (
                  <span>
                    🎉 <strong>Excelente momento!</strong> Seu índice preditivo superou a nota de corte histórica para o {selectedExam.institution}. Mantenha a constância e o treino das discursivas para consolidar sua vaga imediata.
                  </span>
                ) : (
                  <span>
                    🎯 <strong>Faltam apenas {distanceToCutoff} pontos percentuais</strong> para você cruzar a nota de corte para as vagas imediatas. O segredo não é estudar mais horas, mas focar nos <strong>2 tópicos com status Ponto Cego</strong> de maior peso do edital.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cálculo baseado em {metrics.totalAnswered} questões respondidas e histórico de bancas
            </span>
            <button
              onClick={() => onGoToSimulator()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <span>Subir Nota no Simulado</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. MISSÕES DIÁRIAS (MICRO-METAS COM RECOMPENSA DE DOPAMINA) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                  <Star className="w-5 h-5 fill-purple-400/20" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Metas de Hoje</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Cumpra e ganhe XP para subir de nível</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400">
                {missions.filter(m => m.completed).length}/{missions.length} Feitas
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {missions.map((mission) => (
                <div 
                  key={mission.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    mission.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-white/5 hover:border-purple-400/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => handleCompleteMission(mission.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        mission.completed
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'border-2 border-slate-400 dark:border-slate-600 hover:border-emerald-400'
                      }`}
                    >
                      {mission.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">
                          {mission.category}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          +{mission.xpReward} XP
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 leading-snug ${
                        mission.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
                      }`}>
                        {mission.title}
                      </p>
                      
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Progresso: {mission.current}/{mission.target}</span>
                        {mission.actionTab && onGoToTab && !mission.completed && (
                          <button
                            onClick={() => onGoToTab(mission.actionTab!)}
                            className="text-indigo-400 hover:underline font-bold"
                          >
                            Ir agora ➔
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-center text-xs font-semibold text-slate-500">
            Missões reiniciam à meia-noite
          </div>
        </div>

      </div>

      {/* 4. MURAL EXTENSO DE CONQUISTAS & MEDALHAS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Mural de Conquistas & Medalhas
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Desbloqueie medalhas exclusivas e celebre cada marco rumo à sua posse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>{unlockedCount} de {achievements.length} Desbloqueadas</span>
            </span>
          </div>
        </div>

        {/* Abas de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {[
            { id: 'todas', label: 'Todas as Conquistas', count: achievements.length },
            { id: 'bancas', label: 'Bancas & Simulados', count: achievements.filter(a => a.category === 'bancas').length },
            { id: 'lei_seca', label: 'Lei Seca & CF/88', count: achievements.filter(a => a.category === 'lei_seca').length },
            { id: 'disciplina', label: 'Constância & Hábitos', count: achievements.filter(a => a.category === 'disciplina').length },
            { id: 'elite', label: 'Elite & Redação', count: achievements.filter(a => a.category === 'elite').length }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-surface dark:hover:bg-dark-card text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid de Cards de Conquistas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-slate-900/60 border-amber-500/40 shadow-lg shadow-amber-500/5 glow-brand'
                  : 'bg-slate-50 dark:bg-dark-surface/50 border-slate-200 dark:border-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
                    ach.unlocked 
                      ? 'bg-gradient-to-tr from-amber-500/30 to-indigo-500/30 border border-amber-400/40' 
                      : 'bg-slate-200 dark:bg-slate-800 grayscale'
                  }`}>
                    {ach.icon}
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getTierBadge(ach.tier)}`}>
                    {ach.tier}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{ach.title}</span>
                    {ach.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
                {ach.unlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                    <span>✓ Desbloqueada em {ach.unlockedAt}</span>
                    <span className="text-amber-400">+{ach.xpReward} XP</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <span>{ach.currentValue} / {ach.targetValue} {ach.unit}</span>
                      <span className="text-indigo-400 font-bold">+{ach.xpReward} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      <MascotChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        mascot={currentMascot}
      />

    </div>
  );
};
