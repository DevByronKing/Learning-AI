'use client';

import React, { useState } from 'react';
import { 
  Radar, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Building2, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Award, 
  Scale, 
  FileText, 
  Flame,
  ChevronRight,
  TrendingUp,
  MapPin,
  Layers
} from 'lucide-react';
import { ConcursoRadarItem, ConcursoStatus, ConcursoCategory, BrazilRegion } from '@/lib/types';
import { 
  CONCURSOS_RADAR_DATA, 
  OAB_CALENDAR_DATA, 
  ENEM_CALENDAR_DATA 
} from '@/lib/concursosData';
import { BrazilInteractiveMap } from '@/components/BrazilInteractiveMap';

interface ConcursosRadarTabProps {
  onSelectExamNotice?: (noticeId: string) => void;
  onGoToDiscursivas?: () => void;
  showToast: (msg: string) => void;
}

export const ConcursosRadarTab: React.FC<ConcursosRadarTabProps> = ({
  onSelectExamNotice,
  onGoToDiscursivas,
  showToast
}) => {
  const [mainView, setMainView] = useState<'concursos' | 'oab' | 'enem'>('concursos');
  const [statusFilter, setStatusFilter] = useState<'todos' | ConcursoStatus>('todos');
  const [categoryFilter, setCategoryFilter] = useState<'todas' | ConcursoCategory>('todas');
  const [selectedRegion, setSelectedRegion] = useState<BrazilRegion | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtragem dos Concursos
  const filteredConcursos = CONCURSOS_RADAR_DATA.filter((item) => {
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'todas' || item.category === categoryFilter;
    const matchesRegion = selectedRegion === 'todos' || item.region === selectedRegion;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.banca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesRegion && matchesSearch;
  });

  const handleImportToEdital = (editalId?: string, title?: string) => {
    if (editalId && onSelectExamNotice) {
      onSelectExamNotice(editalId);
      showToast(`🎯 Edital de ${title || 'concurso'} carregado na Matriz de Pesos!`);
    } else {
      showToast(`Edital pré-carregado no radar! Importação verticalizada disponível no menu Edital IA.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Hero Banner do Radar */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/50 border border-blue-200/80 dark:border-blue-500/20 p-6 sm:p-10 overflow-hidden shadow-sm dark:shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping" />
            <Radar className="w-3.5 h-3.5" />
            <span>Radar em Tempo Real • Brasil 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Radar Nacional de Concursos, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300">OAB e ENEM</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Monitore editais publicados, bancas contratadas, concursos autorizados e rumores de comissões formadas. 
            Importe o edital verticalizado para a IA do Learning AI com <strong>apenas 1 clique</strong>.
          </p>

          {/* Mini Estatísticas do Radar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <p className="text-xs text-slate-500 dark:text-slate-400">Salários até</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">R$ 31.850</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <p className="text-xs text-slate-500 dark:text-slate-400">Vagas Mapeadas</p>
              <p className="text-lg font-black text-cyan-600 dark:text-cyan-400">8.500+</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <p className="text-xs text-slate-500 dark:text-slate-400">Bancas Monitoradas</p>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400">FGV, Cebraspe, Vunesp</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <p className="text-xs text-slate-500 dark:text-slate-400">OAB & ENEM</p>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">Cronogramas Oficiais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação de Abas do Radar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setMainView('concursos')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
            mainView === 'concursos'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Concursos Públicos ({CONCURSOS_RADAR_DATA.length})</span>
        </button>

        <button
          onClick={() => setMainView('oab')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
            mainView === 'oab'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Exame de Ordem (OAB / CFOAB)</span>
        </button>

        <button
          onClick={() => setMainView('enem')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
            mainView === 'enem'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>ENEM & Matriz TRI</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: CONCURSOS PÚBLICOS NACIONAIS & ESTADUAIS                          */}
      {/* ========================================================================= */}
      {mainView === 'concursos' && (
        <div className="space-y-6">
          
          {/* Mapa Interativo do Brasil com Filtro por Região */}
          <BrazilInteractiveMap
            concursos={CONCURSOS_RADAR_DATA}
            selectedRegion={selectedRegion}
            onSelectRegion={(reg) => {
              setSelectedRegion(reg);
              if (reg !== 'todos') {
                showToast(`📍 Concursos filtrados para a região: ${reg}`);
              }
            }}
          />

          {/* Barra de Filtros e Busca */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              
              {/* Campo de Busca */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por cargo, órgão, banca ou estado (ex: INSS, PF, FGV, SP)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Filtro de Status */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto custom-scrollbar">
                {[
                  { id: 'todos', label: 'Todos os Status' },
                  { id: 'publicado', label: '🟢 Edital Lançado' },
                  { id: 'previsto', label: '🟡 Previsto' },
                  { id: 'rumor', label: '🟣 Rumor Quente' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      statusFilter === s.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de Carreiras */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto custom-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Carreira:
              </span>
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'juridica', label: 'Jurídica (Magistratura, MP, Delegado)' },
                { id: 'policial', label: 'Policial (PF, PRF, PC)' },
                { id: 'fiscal', label: 'Fiscal & Controle (Receita, SEFAZ, TCU)' },
                { id: 'tribunais', label: 'Tribunais (TJ, TRF, TRT, TRE)' },
                { id: 'administrativa', label: 'Administrativa (INSS, Bancos)' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    categoryFilter === c.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cartões de Concursos */}
          {filteredConcursos.length === 0 ? (
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center space-y-3">
              <p className="text-3xl">🔍</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum concurso encontrado com esses filtros</h3>
              <p className="text-xs text-slate-400">Tente ajustar seus termos de pesquisa ou remover os filtros de carreira/status.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcursos.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                          item.status === 'publicado'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : item.status === 'previsto'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}>
                          {item.status === 'publicado' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          {item.status === 'publicado' ? 'Edital Publicado' : item.status === 'previsto' ? 'Previsto' : 'Rumor'}
                        </span>
                        <p className="text-xs text-slate-400 mt-2 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location} ({item.scope})
                        </p>
                      </div>

                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        {item.banca}
                      </span>
                    </div>

                    {/* Título e Cargo */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.institution}</p>
                    </div>

                    {/* Salário e Vagas */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black">Remuneração</p>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{item.salary}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black">Vagas</p>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.vacancies}</p>
                      </div>
                    </div>

                    {/* Datas Críticas */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {item.registrationPeriod && (
                        <p className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>Inscrições: <strong>{item.registrationPeriod}</strong></span>
                        </p>
                      )}
                      {item.examDate && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span>Data da Prova: <strong className="text-slate-900 dark:text-white">{item.examDate}</strong></span>
                        </p>
                      )}
                    </div>

                    {/* Destaques e Matérias Estratégicas */}
                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Estratégia da Banca:
                      </p>
                      {item.keyHighlights.slice(0, 2).map((h, idx) => (
                        <p key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 leading-snug">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Ações do Card */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {item.matchedEditalId ? (
                      <button
                        onClick={() => handleImportToEdital(item.matchedEditalId, item.title)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Carregar no Learning AI</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleImportToEdital(undefined, item.title)}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ver Matriz de Matérias</span>
                      </button>
                    )}

                    {item.officialNoticeUrl && (
                      <a
                        href={item.officialNoticeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Abrir página oficial da banca"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: EXAME DE ORDEM (OAB / CFOAB)                                      */}
      {/* ========================================================================= */}
      {mainView === 'oab' && (
        <div className="space-y-8">
          
          <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
              <Scale className="w-3.5 h-3.5" />
              <span>Conselho Federal da OAB • Calendário Unificado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Guia Completo do Exame de Ordem (1ª e 2ª Fase)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Datas oficiais, regras de repescagem da FGV e metodologia reversa para garantir os 40 pontos na 1ª fase 
              e a nota máxima na Peça Prático-Profissional da 2ª fase.
            </p>
          </div>

          {/* Cards das 3 Edições da OAB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OAB_CALENDAR_DATA.map((oab) => (
              <div
                key={oab.edition}
                className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      oab.status === 'aberto'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {oab.status === 'aberto' ? 'Edição Atual / Ativa' : 'Próxima Edição'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{oab.details.banca}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{oab.edition}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Taxa de Inscrição: {oab.fee}</p>
                  </div>

                  <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 text-xs">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Publicação do Edital:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{oab.editalDate}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Inscrições:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{oab.registrationPeriod}</strong>
                    </p>
                    <p className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-blue-500 font-bold">1ª Fase (Objetiva):</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-black">{oab.phase1Date}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-amber-500 font-bold">2ª Fase (Peça):</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-black">{oab.phase2Date}</strong>
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Matérias de Maior Peso (Garantem os 40 pontos):
                    </p>
                    {oab.details.criticalSubjects.map((sub, idx) => (
                      <p key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{sub}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onGoToDiscursivas ? onGoToDiscursivas() : showToast('Acesse a aba Discursivas para treinar peças!')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Treinar Peças no Studio OAB</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Banner de Repescagem OAB */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Como Funciona a Repescagem (Reaproveitamento de Fase da OAB)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              O candidato que for aprovado na 1ª fase (atingindo 40 ou mais acertos) mas não obtiver a nota 6,0 na prova prático-profissional da 2ª fase tem o direito legal de realizar a 2ª fase do exame imediatamente subsequente sem precisar refazer a 1ª fase objetiva.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: ENEM & TEORIA DE RESPOSTA AO ITEM (TRI)                           */}
      {/* ========================================================================= */}
      {mainView === 'enem' && (
        <div className="space-y-8">
          
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>INEP / MEC • Matriz de Referência Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ENEM 2026: Cronograma, Redação Nota 1000 & TRI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              O ENEM é corrigido através da Teoria de Resposta ao Item (TRI). Entenda a mecânica estatística 
              e os 5 critérios fundamentais que a banca examinadora utiliza na redação dissertativo-argumentativa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Datas do ENEM */}
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Datas Críticas do ENEM 2026
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Período de Solicitação de Isenção:</span>
                  <strong className="text-slate-900 dark:text-white">{ENEM_CALENDAR_DATA.exemptionPeriod}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Inscrições Abertas:</span>
                  <strong className="text-slate-900 dark:text-white">{ENEM_CALENDAR_DATA.registrationPeriod}</strong>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                  <span>Dia 1 (Humanas + Linguagens + Redação):</span>
                  <span>{ENEM_CALENDAR_DATA.day1Date}</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-500/30 flex justify-between text-blue-700 dark:text-blue-300 font-bold">
                  <span>Dia 2 (Natureza + Matemática):</span>
                  <span>{ENEM_CALENDAR_DATA.day2Date}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Divulgação de Resultados:</span>
                  <strong className="text-slate-900 dark:text-white">{ENEM_CALENDAR_DATA.resultDate}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Inscrições no SISU:</span>
                  <strong className="text-slate-900 dark:text-white">{ENEM_CALENDAR_DATA.sisuDate}</strong>
                </div>
              </div>
            </div>

            {/* As 5 Competências da Redação 1000 */}
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                As 5 Competências da Redação Nota 1000
              </h3>

              <div className="space-y-2 text-xs">
                {ENEM_CALENDAR_DATA.details.redacaoCriteria.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{c}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
