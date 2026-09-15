'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Target, 
  Clock, 
  Award, 
  Zap, 
  ChevronRight, 
  Flame, 
  ShieldCheck, 
  BrainCircuit, 
  BookOpen,
  Crown
} from 'lucide-react';
import { StudentProfile, GuardianAnimalId, SubscriptionPlan } from '@/lib/types';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';
import confetti from 'canvas-confetti';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
  userPlan: SubscriptionPlan;
  onOpenPricing?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  userPlan,
  onOpenPricing
}) => {
  const [name, setName] = useState(profile.name || 'Concurseiro');
  const [warName, setWarName] = useState(profile.warName || 'Futuro Servidor');
  const [targetCareer, setTargetCareer] = useState(profile.targetCareer || 'policial');
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(profile.dailyHoursGoal || 4);
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel || 'intermediario');
  const [selectedAnimalId, setSelectedAnimalId] = useState<GuardianAnimalId>(profile.guardianAnimalId || 'coruja');
  const [activeSubTab, setActiveSubTab] = useState<'animal' | 'dados'>('animal');

  if (!isOpen) return null;

  const selectedAnimal = GUARDIAN_ANIMALS.find((a) => a.id === selectedAnimalId) || GUARDIAN_ANIMALS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...profile,
      name: name.trim() || 'Concurseiro',
      warName: warName.trim() || 'Futuro Servidor',
      targetCareer: targetCareer as any,
      dailyHoursGoal,
      experienceLevel: experienceLevel as any,
      guardianAnimalId: selectedAnimalId,
      updatedAt: new Date().toISOString()
    };

    onSaveProfile(updated);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Selected Animal's Aesthetic */}
        <div className={`p-6 sm:p-7 bg-gradient-to-r ${selectedAnimal.colorGradient} relative overflow-hidden transition-all duration-500`}>
          <div className="absolute -right-8 -bottom-8 opacity-20 text-9xl select-none pointer-events-none filter blur-[1px]">
            {selectedAnimal.emoji}
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            title="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Passaporte Cognitivo do Estudante</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-white text-[11px] font-bold uppercase">
              Plano {userPlan.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl sm:text-5xl shadow-lg shrink-0">
              {selectedAnimal.emoji}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-white truncate drop-shadow-sm">
                {name} <span className="text-white/80 font-normal text-sm sm:text-base">({warName})</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-1">
                {selectedAnimal.name} • {selectedAnimal.title}
              </p>
              <p className="text-[11px] text-white/70 italic mt-0.5">
                {selectedAnimal.motto}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs between Animal Selection and Personal Data */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('animal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'animal'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
            >
              <span>🐾 Escolha do Animal Guardião</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('dados')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'dados'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
            >
              <span>🎯 Carreira, Carga & Metas</span>
            </button>
          </div>

          {userPlan === 'aspirante' && onOpenPricing && (
            <button
              type="button"
              onClick={() => { onClose(); onOpenPricing(); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black hover:opacity-95 transition-opacity"
            >
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span>UPGRADE PRO</span>
            </button>
          )}
        </div>

        {/* Modal Body with Scroll */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {activeSubTab === 'animal' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" />
                  <span>Escolha o Arquétipo que Representa sua Jornada de Concurseiro:</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Cada animal guardião confere uma identidade cognitiva, foco estratégico e frase-guia personalizada no painel e nos simulados.
                </p>
              </div>

              {/* Grid of 6 Animals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {GUARDIAN_ANIMALS.map((animal) => {
                  const isSelected = selectedAnimalId === animal.id;
                  return (
                    <div
                      key={animal.id}
                      onClick={() => setSelectedAnimalId(animal.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/40 shadow-md dark:bg-indigo-950/40 dark:border-indigo-400 dark:ring-indigo-500/50'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/70 dark:hover:bg-slate-800 dark:hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow">
                          ✓
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl p-1.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 shadow-sm">
                            {animal.emoji}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{animal.name}</h4>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block truncate">{animal.archetype}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-2 font-medium">
                          {animal.superpower}
                        </p>
                      </div>

                      {/* Small stats bars */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/5 space-y-1 text-[9px] font-mono">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>Foco</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{animal.stats.foco}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 dark:bg-emerald-400" style={{ width: `${animal.stats.foco}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>Velocidade</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{animal.stats.velocidade}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 dark:bg-cyan-400" style={{ width: `${animal.stats.velocidade}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Breakdown of Currently Selected Animal */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Estilo Cognitivo de {selectedAnimal.name}:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedAnimal.cognitiveStyle}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Carreiras Recomendadas:</span>
                  {selectedAnimal.bestForCareers.map((car, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 text-[10px] font-medium border border-indigo-200 dark:border-indigo-500/20">
                      {car}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'dados' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">
                    Nome Completo / Como quer ser chamado:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ex: Lucas Barbosa"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">
                    Nome de Guerra / Apelido no Ranking:
                  </label>
                  <input
                    type="text"
                    value={warName}
                    onChange={(e) => setWarName(e.target.value)}
                    placeholder="Ex: Agente Barbosa / Auditor 01"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">
                    Área / Carreira Alvo:
                  </label>
                  <select
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="policial">Policial (PF, PRF, PC, PM)</option>
                    <option value="fiscal">Fiscal (Receita, SEFAZ, ISS)</option>
                    <option value="tribunais">Tribunais & Judiciário</option>
                    <option value="administrativa">Administrativa & Gestão</option>
                    <option value="juridica">Carreiras Jurídicas (MP, DP, Magistratura)</option>
                    <option value="controle">Controle (TCU, TCE, CGE)</option>
                    <option value="outra">Outras Carreiras Públicas</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">
                    Meta Diária de Estudos:
                  </label>
                  <select
                    value={dailyHoursGoal}
                    onChange={(e) => setDailyHoursGoal(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value={2}>2 horas líquidas / dia</option>
                    <option value={3}>3 horas líquidas / dia (Padrão)</option>
                    <option value={4}>4 horas líquidas / dia</option>
                    <option value={6}>6 horas líquidas / dia (Intensivo)</option>
                    <option value={8}>8+ horas (Dedicação Exclusiva)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">
                    Tempo de Preparação:
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="iniciante">Começando Agora (0 - 6 meses)</option>
                    <option value="intermediario">Construindo Base (6 meses - 2 anos)</option>
                    <option value="veterano">Veterano de Prova (2+ anos de estudo)</option>
                  </select>
                </div>
              </div>

              {/* Informative Plan Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Seu Status Atual</span>
                  <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Plano {userPlan.toUpperCase()} Ativo</span>
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {userPlan === 'aspirante'
                      ? '5 diagnósticos com IA/dia + gabaritos e leis ilimitados (Opção A).'
                      : userPlan === 'pro'
                      ? '100 diagnósticos/dia + 100 mensagens Copiloto + 3 discursivas/mês.'
                      : 'Diagnósticos e Copiloto ilimitados + 20 discursivas/mês.'}
                  </p>
                </div>
                {userPlan === 'aspirante' && onOpenPricing && (
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenPricing(); }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shrink-0"
                  >
                    Mudar de Plano
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Passaporte Cognitivo</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
