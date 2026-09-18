'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  Building2, 
  ChevronRight, 
  Award,
  Globe,
  Filter
} from 'lucide-react';
import { BrazilRegion, ConcursoRadarItem } from '@/lib/types';

interface BrazilInteractiveMapProps {
  concursos: ConcursoRadarItem[];
  selectedRegion: BrazilRegion | 'todos';
  onSelectRegion: (region: BrazilRegion | 'todos') => void;
}

interface RegionMeta {
  name: BrazilRegion;
  label: string;
  states: string[];
  color: string;
  darkColor: string;
  badgeBg: string;
  badgeText: string;
  svgCenter: { x: number; y: number };
  svgPath: string; // SVG path data representing the macro-region
}

const REGIONS_DATA: RegionMeta[] = [
  {
    name: 'Norte',
    label: 'Região Norte',
    states: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'],
    color: '#10B981',
    darkColor: '#34D399',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    svgCenter: { x: 190, y: 150 },
    // Simplified, stylized polygon representing Northern Brazil
    svgPath: 'M 100 130 Q 140 70, 240 75 Q 310 90, 315 170 Q 280 215, 235 220 Q 170 240, 130 220 Q 90 200, 100 130 Z'
  },
  {
    name: 'Nordeste',
    label: 'Região Nordeste',
    states: ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'PI', 'SE'],
    color: '#F59E0B',
    darkColor: '#FBBF24',
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-700 dark:text-amber-300',
    svgCenter: { x: 380, y: 190 },
    // Stylized polygon representing Northeast Brazil
    svgPath: 'M 315 170 Q 380 120, 450 160 Q 470 210, 430 260 Q 370 280, 340 260 Q 320 220, 315 170 Z'
  },
  {
    name: 'Centro-Oeste',
    label: 'Centro-Oeste & DF',
    states: ['DF', 'GO', 'MT', 'MS'],
    color: '#06B6D4',
    darkColor: '#22D3EE',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    svgCenter: { x: 250, y: 280 },
    // Stylized polygon representing Central-West Brazil
    svgPath: 'M 190 235 Q 270 230, 320 260 Q 330 330, 280 370 Q 210 360, 180 300 Q 175 250, 190 235 Z'
  },
  {
    name: 'Sudeste',
    label: 'Região Sudeste',
    states: ['SP', 'RJ', 'MG', 'ES'],
    color: '#3B82F6',
    darkColor: '#60A5FA',
    badgeBg: 'bg-blue-500/15 border-blue-500/30',
    badgeText: 'text-blue-700 dark:text-blue-300',
    svgCenter: { x: 345, y: 350 },
    // Stylized polygon representing Southeast Brazil
    svgPath: 'M 320 265 Q 390 275, 415 320 Q 390 380, 320 395 Q 300 345, 320 265 Z'
  },
  {
    name: 'Sul',
    label: 'Região Sul',
    states: ['PR', 'SC', 'RS'],
    color: '#8B5CF6',
    darkColor: '#A78BFA',
    badgeBg: 'bg-purple-500/15 border-purple-500/30',
    badgeText: 'text-purple-700 dark:text-purple-300',
    svgCenter: { x: 260, y: 440 },
    // Stylized polygon representing South Brazil
    svgPath: 'M 265 375 Q 320 395, 305 450 Q 275 510, 230 490 Q 220 430, 265 375 Z'
  }
];

export const BrazilInteractiveMap: React.FC<BrazilInteractiveMapProps> = ({
  concursos,
  selectedRegion,
  onSelectRegion
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<BrazilRegion | null>(null);

  // Calcula estatísticas por região
  const getRegionStats = (regionName: BrazilRegion) => {
    const directList = concursos.filter(c => c.region === regionName);
    const abertos = directList.filter(c => c.status === 'publicado').length;
    const previstos = directList.filter(c => c.status === 'previsto').length;
    
    return {
      total: directList.length,
      abertos,
      previstos,
      topConcurso: directList[0]?.title || 'Editais Federais com Vagas Locais',
      salarioTeto: directList.reduce((max, c) => {
        const num = parseFloat(c.salary.replace(/[^\d]/g, '')) || 0;
        return num > max.num ? { num, str: c.salary } : max;
      }, { num: 0, str: 'R$ 14.800,00' }).str
    };
  };

  const totalNacional = concursos.filter(c => c.region === 'Nacional').length;
  const activeHover = hoveredRegion || (selectedRegion !== 'todos' ? selectedRegion : null);

  return (
    <div className="rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Cabeçalho do Mapa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Mapeamento Geográfico de Oportunidades 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Mapa Interativo de Concursos por Região</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Clique em uma região do mapa ou nas opções abaixo para filtrar editais e salários locais em tempo real:
          </p>
        </div>

        {/* Botão de Reset / Todo o Brasil */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectRegion('todos')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              selectedRegion === 'todos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Ver Todo o Brasil ({concursos.length})</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Mapa SVG Interativo + Painel de Detalhes da Região */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Coluna 1: Mapa Vetorial SVG Interativo do Brasil */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          
          <div className="relative w-full max-w-[480px] aspect-[1/1] p-4 flex items-center justify-center">
            
            {/* SVG Vetorial do Brasil com as 5 Macrorregiões */}
            <svg 
              viewBox="60 40 440 480" 
              className="w-full h-full drop-shadow-md select-none"
            >
              <defs>
                {/* Filtros de Glow */}
                <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Regiões como polígonos clicáveis e reativos */}
              {REGIONS_DATA.map((reg) => {
                const isSelected = selectedRegion === reg.name;
                const isHovered = hoveredRegion === reg.name;
                
                return (
                  <g 
                    key={reg.name}
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={() => onSelectRegion(isSelected ? 'todos' : reg.name)}
                    onMouseEnter={() => setHoveredRegion(reg.name)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    {/* Path da Macrorregião */}
                    <path
                      d={reg.svgPath}
                      fill={isSelected ? reg.color : (isHovered ? reg.darkColor : 'currentColor')}
                      className={`transition-all duration-300 ${
                        isSelected 
                          ? 'opacity-95 stroke-2 stroke-white dark:stroke-slate-900' 
                          : isHovered
                          ? 'opacity-85 stroke-2 stroke-white dark:stroke-slate-700'
                          : 'text-slate-200 dark:text-slate-800/80 hover:text-slate-300 dark:hover:text-slate-700 stroke-1 stroke-slate-300 dark:stroke-slate-700'
                      }`}
                      style={{
                        filter: isSelected ? 'url(#glow-selected)' : undefined,
                        transformOrigin: `${reg.svgCenter.x}px ${reg.svgCenter.y}px`
                      }}
                    />

                    {/* Rótulo e Marcador da Região no Centro do SVG */}
                    <g className="pointer-events-none">
                      <circle
                        cx={reg.svgCenter.x}
                        cy={reg.svgCenter.y - 8}
                        r={isSelected ? 10 : 7}
                        fill={isSelected ? '#ffffff' : reg.color}
                        stroke={isSelected ? reg.color : '#ffffff'}
                        strokeWidth={2}
                        className="transition-all duration-300"
                      />
                      <text
                        x={reg.svgCenter.x}
                        y={reg.svgCenter.y + 16}
                        textAnchor="middle"
                        className={`text-[12px] font-black tracking-wide select-none ${
                          isSelected
                            ? 'fill-slate-900 dark:fill-white font-extrabold'
                            : 'fill-slate-600 dark:fill-slate-400'
                        }`}
                      >
                        {reg.name}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Ponto Estratégico de Brasília / Concursos Nacionais */}
              <g 
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectRegion('Nacional')}
                onMouseEnter={() => setHoveredRegion('Nacional')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <circle
                  cx={310}
                  cy={285}
                  r={selectedRegion === 'Nacional' ? 9 : 6}
                  fill={selectedRegion === 'Nacional' ? '#EC4899' : '#3B82F6'}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="animate-pulse"
                />
                <text
                  x={310}
                  y={303}
                  textAnchor="middle"
                  className="text-[9px] font-black fill-blue-600 dark:fill-blue-400"
                >
                  DF (Nacional)
                </text>
              </g>
            </svg>

            {/* Dica de Ação */}
            <span className="absolute bottom-1 text-[11px] text-slate-400 font-medium">
              💡 Dica: Passe o mouse ou clique em qualquer região para filtrar
            </span>
          </div>
        </div>

        {/* Coluna 2: Card de Raio-X da Região Selecionada / Sob Foco */}
        <div className="lg:col-span-5 space-y-4">
          {(() => {
            const activeMeta = REGIONS_DATA.find(r => r.name === activeHover) || {
              name: 'Nacional' as BrazilRegion,
              label: 'Concursos Nacionais & Federais',
              states: ['Brasil Todo', 'Capitais', 'Fronteiras'],
              color: '#3B82F6',
              darkColor: '#60A5FA',
              badgeBg: 'bg-blue-500/15 border-blue-500/30',
              badgeText: 'text-blue-700 dark:text-blue-300',
              svgCenter: { x: 310, y: 285 },
              svgPath: ''
            };

            const stats = getRegionStats(activeMeta.name);

            return (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
                
                {/* Header da Região em Destaque */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full" 
                      style={{ backgroundColor: activeMeta.color }}
                    />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {activeMeta.label}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${activeMeta.badgeBg} ${activeMeta.badgeText}`}>
                    {selectedRegion === activeMeta.name ? 'Filtro Ativo' : 'Em Foco'}
                  </span>
                </div>

                {/* Estados Mapeados */}
                <div className="flex flex-wrap gap-1 text-[11px]">
                  <span className="text-slate-400 mr-1 font-bold">Estados:</span>
                  {activeMeta.states.map(uf => (
                    <span 
                      key={uf} 
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                    >
                      {uf}
                    </span>
                  ))}
                </div>

                {/* Mini Métricas da Região */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-black text-slate-400">Editais Mapeados</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      {stats.total} <span className="text-xs font-normal text-slate-400">concursos</span>
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {stats.abertos} abertos • {stats.previstos} previstos
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-black text-slate-400">Salário Teto</span>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {stats.salarioTeto}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">Remuneração inicial</span>
                  </div>
                </div>

                {/* Edital Principal em Destaque */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 space-y-1 text-xs">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                    Principal Oportunidade:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white leading-snug">
                    {stats.topConcurso}
                  </p>
                </div>

                {/* Botão de Ação Direta */}
                <button
                  onClick={() => onSelectRegion(activeMeta.name)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow"
                >
                  <span>Filtrar Concursos da {activeMeta.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            );
          })()}
        </div>

      </div>

      {/* Pílulas de Seleção Rápida (Excelente para Mobile) */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar pb-1">
        <span className="text-xs font-black text-slate-400 whitespace-nowrap mr-1">Filtrar por:</span>
        
        <button
          onClick={() => onSelectRegion('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedRegion === 'todos'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          🇧🇷 Todo o Brasil
        </button>

        <button
          onClick={() => onSelectRegion('Nacional')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedRegion === 'Nacional'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          🏛️ Nacional / Federal ({totalNacional})
        </button>

        {REGIONS_DATA.map(reg => {
          const isSelected = selectedRegion === reg.name;
          const count = concursos.filter(c => c.region === reg.name).length;
          return (
            <button
              key={reg.name}
              onClick={() => onSelectRegion(isSelected ? 'todos' : reg.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: reg.color }}
              />
              <span>{reg.name} ({count})</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
