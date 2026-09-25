'use client';

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Sparkles, 
  Crown, 
  Zap, 
  Lock, 
  CheckCircle2, 
  BrainCircuit, 
  Sliders, 
  Download, 
  Trash2, 
  Save, 
  Bell, 
  Target, 
  Clock, 
  Eye, 
  Flame,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  RotateCcw,
  HeartHandshake
} from 'lucide-react';
import { StudentProfile, SubscriptionPlan, GuardianAnimalId } from '@/lib/types';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';

interface UserSettingsTabProps {
  studentProfile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
  currentPlan: SubscriptionPlan;
  onOpenPricing: () => void;
  onOpenCheckout?: (plan: SubscriptionPlan) => void;
  showToast: (msg: string) => void;
  onRestartOnboarding?: () => void;
}

export const UserSettingsTab: React.FC<UserSettingsTabProps> = ({
  studentProfile,
  onSaveProfile,
  currentPlan,
  onOpenPricing,
  onOpenCheckout,
  showToast,
  onRestartOnboarding
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'tiers' | 'ai_preferences' | 'privacy'>('profile');

  // Form State
  const [name, setName] = useState(studentProfile.name || '');
  const [warName, setWarName] = useState(studentProfile.warName || '');
  const [targetCareer, setTargetCareer] = useState(studentProfile.targetCareer || 'policial');
  const [targetExamTitle, setTargetExamTitle] = useState(studentProfile.targetExamTitle || '');
  const [dailyHoursGoal, setDailyHoursGoal] = useState(studentProfile.dailyHoursGoal || 4);
  const [experienceLevel, setExperienceLevel] = useState(studentProfile.experienceLevel || 'intermediario');
  const [guardianAnimalId, setGuardianAnimalId] = useState<GuardianAnimalId>(studentProfile.guardianAnimalId || 'coruja');

  // AI & Study Preferences
  const [aiExplanationStyle, setAiExplanationStyle] = useState<'direto' | 'socratico' | 'jurisprudencial'>('direto');
  const [aiRigorLevel, setAiRigorLevel] = useState<'equilibrado' | 'extremo_fgv' | 'lei_seca'>('extremo_fgv');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [highTempModelEnabled, setHighTempModelEnabled] = useState(currentPlan === 'elite');

  const currentGuardian = GUARDIAN_ANIMALS.find(a => a.id === guardianAnimalId) || GUARDIAN_ANIMALS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...studentProfile,
      name,
      warName,
      targetCareer: targetCareer as any,
      targetExamTitle,
      dailyHoursGoal: Number(dailyHoursGoal),
      experienceLevel: experienceLevel as any,
      guardianAnimalId,
      updatedAt: new Date().toISOString()
    };
    onSaveProfile(updated);
    showToast('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        profile: studentProfile,
        plan: currentPlan,
        exportedAt: new Date().toISOString(),
        system: 'Learning AI - LGPD Data Portability (Art. 18)'
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning_ai_meus_dados_${studentProfile.warName || 'aluno'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Dados exportados com sucesso em conformidade com a LGPD.');
    } catch {
      showToast('Erro ao exportar dados.');
    }
  };

  const handleClearCache = () => {
    if (confirm('Deseja realmente limpar o cache de estudos local? Suas configurações de perfil serão mantidas.')) {
      try {
        localStorage.removeItem('learning_ai_temp_cache');
        showToast('Cache local liberado com sucesso.');
      } catch {}
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Header com Cartão de Identidade do Aluno */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-3xl sm:text-4xl">
                {currentGuardian.emoji}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {warName ? warName : (name || 'Guerreiro(a)')}
                </h1>
                
                {/* Plan Badge */}
                {currentPlan === 'aspirante' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    Aspirante (Freemium)
                  </span>
                )}
                {currentPlan === 'pro' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> PRO
                  </span>
                )}
                {currentPlan === 'elite' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> ELITE VIP
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Guardião: <strong className="text-blue-600 dark:text-blue-400">{currentGuardian.name}</strong> ({currentGuardian.title}) • Meta: {dailyHoursGoal}h diárias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentPlan !== 'elite' && (
              <button
                onClick={() => onOpenCheckout ? onOpenCheckout('elite') : onOpenPricing()}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Fazer Upgrade para Elite</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navegação de Configurações */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil & Carreira</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tiers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'tiers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Opções por Plano (Freemium / Pro / Elite)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'ai_preferences'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Preferências da IA & Estudo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'privacy'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacidade & LGPD</span>
        </button>
      </div>

      {/* ABA 1: PERFIL & CARREIRA */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          {/* Card de Refazer Onboarding */}
          {onRestartOnboarding && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-emerald-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Protocolo de Iniciação & Onboarding Cognitivo
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Deseja recalibrar seu concurso alvo, redefinir suas metas e emitir um novo Passaporte Cognitivo?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRestartOnboarding}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider whitespace-nowrap shadow-sm shadow-blue-600/20 active:scale-95 transition-all"
              >
                Refazer Diagnóstico
              </button>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Dados do Estudante</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Personalize sua identidade e direcionamento estratégico de estudos.</p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Souza"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nome de Guerra / Apelido no App
              </label>
              <input
                type="text"
                value={warName}
                onChange={(e) => setWarName(e.target.value)}
                placeholder="Ex: Delta Souza, Fiscal Alpha"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Carreira Foco
              </label>
              <select
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
              >
                <option value="policial">🚨 Policial (PF, PRF, PC, PM, DEPEN)</option>
                <option value="fiscal">📈 Fiscal & Controle (Receita Federal, SEFAZ, TCU, CGU)</option>
                <option value="tribunais">⚖️ Tribunais (TJ, TRF, TRT, TSE, TRE)</option>
                <option value="juridica">🏛️ Jurídica (Magistratura, MP, Defensoria, Delegado)</option>
                <option value="administrativa">📋 Administrativa & Bancária (INSS, Bancos, MGI)</option>
                <option value="oab">🎓 Exame de Ordem (OAB 1ª e 2ª Fase)</option>
                <option value="enem">📚 ENEM & Vestibulares (TRI + Redação 1000)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Meta Diária de Estudos (Horas Líquidas)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={dailyHoursGoal}
                  onChange={(e) => setDailyHoursGoal(Number(e.target.value))}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <span className="w-16 text-center font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl text-sm border border-blue-200 dark:border-blue-500/20">
                  {dailyHoursGoal}h / dia
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nível de Bagagem em Concursos
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="iniciante">🌱 Iniciante (Começando do absoluto zero)</option>
                <option value="intermediario">⚡ Intermediário (Já estudei matérias básicas, busco ritmo)</option>
                <option value="veterano">🔥 Veterano (Acertando 75%+ e lapidando detalhes de banca)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Edital Específico Alvo (Opcional)
              </label>
              <input
                type="text"
                value={targetExamTitle}
                onChange={(e) => setTargetExamTitle(e.target.value)}
                placeholder="Ex: Auditor SEFAZ-SP ou PF Agente"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Seleção do Animal Guardião */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Companheiro Animal Guardião (Seu Arquétipo Cognitivo)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GUARDIAN_ANIMALS.map((animal) => {
                const isSelected = animal.id === guardianAnimalId;
                return (
                  <button
                    type="button"
                    key={animal.id}
                    onClick={() => setGuardianAnimalId(animal.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{animal.emoji}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {animal.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{animal.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/30 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
        </div>
      )}

      {/* ABA 2: OPÇÕES POR PLANO (FREEMIUM / PRO / ELITE) */}
      {activeSubTab === 'tiers' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-purple-50/50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border border-blue-200/80 dark:border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Painel de Recursos por Nível de Assinatura
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Confira os recursos liberados no seu plano atual e os recursos disponíveis para upgrade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* TIER 1: ASPIRANTE (FREEMIUM) */}
            <div className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              currentPlan === 'aspirante'
                ? 'bg-white dark:bg-dark-surface border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Aspirante (Freemium)
                  </span>
                  {currentPlan === 'aspirante' && (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Plano Atual
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">R$ 0</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">Acesso básico permanente (Isca PLG)</p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>5 Diagnósticos Cognitivos IA / dia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>1 Edital pré-carregado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Banco: 20 questões / dia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Caderno de Erros (Visualização)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Radar & Mapa Nacional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Vade Mecum (3 consultas/dia)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>1 Correção Demo de Discursiva</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="line-through">Psicometria TRI da Banca</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 block text-center">
                  {currentPlan === 'aspirante' ? 'Você está neste plano' : 'Plano de entrada'}
                </span>
              </div>
            </div>

            {/* TIER 2: PRO */}
            <div className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              currentPlan === 'pro'
                ? 'bg-white dark:bg-dark-surface border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              {currentPlan !== 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                  Concurseiro Focado
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                    Plano PRO
                  </span>
                  {currentPlan === 'pro' && (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Plano Atual
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  R$ 59,90 <span className="text-xs font-normal text-slate-400">/mês</span>
                </h3>
                <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold mt-0.5">ou R$ 39,90/mês no plano anual</p>
                <p className="text-xs text-slate-400 mt-1 mb-6">Para concurseiros em ritmo acelerado</p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Diagnósticos Cognitivos Ilimitados (Flash)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Até 4 Editais Simultâneos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Banco Ilimitado (25k+ questões)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Caderno de Erros SM-2 Completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Radar de Editais com Alertas de Bancas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Vade Mecum (Artigos Quentes)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Suporte prioritário por e-mail</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="line-through">Correções Discursivas & OAB</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                {currentPlan === 'pro' ? (
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block text-center">
                    Seu Plano Ativo
                  </span>
                ) : (
                  <button
                    onClick={() => onOpenCheckout ? onOpenCheckout('pro') : onOpenPricing()}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    Ativar Plano PRO
                  </button>
                )}
              </div>
            </div>

            {/* TIER 3: ELITE */}
            <div className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              currentPlan === 'elite'
                ? 'bg-white dark:bg-dark-surface border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                Alta Performance & OAB
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                    ELITE VIP
                  </span>
                  {currentPlan === 'elite' && (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Plano Atual
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  R$ 129,90 <span className="text-xs font-normal text-slate-400">/mês</span>
                </h3>
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">ou R$ 89,90/mês no plano anual</p>
                <p className="text-xs text-slate-400 mt-1 mb-6">Para quem busca os primeiros lugares e OAB</p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                    <Crown className="w-4 h-4 shrink-0" />
                    <span>Diagnósticos Cognitivos (Gemini Pro)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Editais Ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Banco Ilimitado + Filtros TRI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Caderno com Análise de Distratores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Radar com Histórico de Cortes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Vade Mecum + Súmulas & Jurisprudência</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>10 Correções / mês (Peças OAB + Redação)</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Psicometria TRI da Banca Liberada</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Suporte VIP WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                {currentPlan === 'elite' ? (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block text-center">
                    Seu Plano Ativo
                  </span>
                ) : (
                  <button
                    onClick={() => onOpenCheckout ? onOpenCheckout('elite') : onOpenPricing()}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    Fazer Upgrade para Elite
                  </button>
                )}
              </div>
            </div>

            {/* TIER 4: BLACK VITALÍCIO */}
            <div className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              currentPlan === 'black'
                ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-2xl text-white'
                : 'bg-gradient-to-b from-slate-900 via-slate-900 to-black border-amber-500/50 shadow-xl text-white'
            }`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                ★ Acesso Até a Posse
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    BLACK VITALÍCIO
                  </span>
                  {currentPlan === 'black' && (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Plano Atual
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white">
                  R$ 1.497 <span className="text-xs font-normal text-amber-300/70">único</span>
                </h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">em até 12x de R$ 149,70 (ou R$ 197/mês)</p>
                <p className="text-xs text-slate-400 mt-1 mb-6">Pague uma vez e use até o Diário Oficial</p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Diagnósticos Prioritários Sem Fila</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Editais Ilimitados + Importação Custom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Banco + Questões Inéditas com IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Caderno com Previsão de Retenção</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Radar + Análise de Concorrência</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Vade Mecum + Áudio-Artigos IA</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-amber-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Correções Ilimitadas (OAB + Redações)</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-amber-300">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Simulador Cognitivo de Prova Oral IA</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-amber-300">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Guardião Mítico: Fênix Dourada</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gerente de Sucesso / Suporte 1-a-1</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                {currentPlan === 'black' ? (
                  <span className="text-xs font-bold text-amber-400 block text-center">
                    Você possui o nível mais alto! (Vitalício)
                  </span>
                ) : (
                  <button
                    onClick={() => onOpenCheckout ? onOpenCheckout('black') : onOpenPricing()}
                    className="w-full py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
                  >
                    Tornar-se BLACK Vitalício
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ABA 3: PREFERÊNCIAS DA IA & ESTUDO */}
      {activeSubTab === 'ai_preferences' && (
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Comportamento do Copiloto Cognitivo
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ajuste fino da forma como o Gemini 1.5 analisa seus erros e responde suas dúvidas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Estilo de Feedback nas Questões</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Como a IA deve redigir a justificativa do seu erro.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiExplanationStyle('direto')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aiExplanationStyle === 'direto'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Direto ao Ponto
                </button>
                <button
                  type="button"
                  onClick={() => setAiExplanationStyle('socratico')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aiExplanationStyle === 'socratico'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Método Socrático
                </button>
                <button
                  type="button"
                  onClick={() => setAiExplanationStyle('jurisprudencial')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aiExplanationStyle === 'jurisprudencial'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Jurisprudencial STF/STJ
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Modo Foco Extremo de Resolução</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Oculta temporizadores e métricas para simular ambiente real de prova.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={focusModeEnabled}
                  onChange={(e) => setFocusModeEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Motor de Alta Profundidade (Gemini 1.5 Pro)</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    EXCLUSIVO ELITE
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Utiliza a rede neural de maior raciocínio jurídico para discursivas complexas.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={currentPlan !== 'elite'}
                  checked={highTempModelEnabled && currentPlan === 'elite'}
                  onChange={(e) => setHighTempModelEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  currentPlan === 'elite'
                    ? 'bg-slate-200 dark:bg-slate-700 peer-checked:bg-amber-500 peer-checked:after:translate-x-full'
                    : 'bg-slate-300 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                }`}></div>
              </label>
            </div>
          </div>

          {/* Ciclo de Feedback & Pesquisa de PMF */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-indigo-500" />
                <span>Avaliação de Produto & Melhoria Contínua</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sua opinião direta orienta o desenvolvimento das próximas ferramentas e calibrações do AprovaLens.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/50 via-indigo-50/40 to-slate-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-slate-900/40 border border-blue-200/60 dark:border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold uppercase">
                    Sean Ellis PMF Test
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Pesquisa de Experiência do Estudante</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  Conte-nos se a plataforma está sendo indispensável na sua preparação e o que podemos calibrar nos simuladores e no caderno de erros.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-pmf-survey'));
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Responder Pesquisa</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => showToast('Preferências de IA atualizadas!')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/30 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>
      )}

      {/* ABA 4: PRIVACIDADE & LGPD */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Privacidade de Dados & Conformidade LGPD (Lei nº 13.709/2018)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Você tem total soberania e controle sobre suas informações, estatísticas de erros e histórico de estudo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Portabilidade de Dados (Art. 18, V)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Baixe um arquivo JSON com todas as suas resoluções, diagnósticos e perfil completo.
              </p>
              <button
                onClick={handleExportData}
                className="w-full py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Meus Dados
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Limpeza de Cache e Histórico Local</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Libere armazenamento temporário do navegador mantendo sua assinatura e guardião intactos.
              </p>
              <button
                onClick={handleClearCache}
                className="w-full py-2 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold text-rose-600 dark:text-rose-400 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Cache Local
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Segurança de Ponta a Ponta:</strong> Todos os seus dados são criptografados em trânsito (TLS 1.3) e em repouso nos nossos servidores com backup diário no Supabase. O Learning AI nunca vende seus dados para terceiros.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
