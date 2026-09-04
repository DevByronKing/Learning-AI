import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Calendar, 
  Award, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  BrainCircuit,
  BookOpen
} from 'lucide-react';

interface EditalPageProps {
  params: {
    slug: string;
  };
}

// Catálogo de editais pré-configurados para SEO
const EDITAIS_CATALOG: Record<string, {
  title: string;
  institution: string;
  banca: string;
  role: string;
  salary: string;
  vacancies: number;
  examDate: string;
  subjects: { name: string; weight: number; topicsCount: number }[];
}> = {
  'inss-tecnico-seguro-social-2026': {
    title: 'Edital INSS 2026 — Técnico do Seguro Social',
    institution: 'Instituto Nacional do Seguro Social (INSS)',
    banca: 'Cebraspe',
    role: 'Técnico do Seguro Social',
    salary: 'R$ 6.596,52 + Benefícios',
    vacancies: 1500,
    examDate: 'Outubro de 2026',
    subjects: [
      { name: 'Seguridade Social (Legislação Previdenciária)', weight: 3, topicsCount: 38 },
      { name: 'Língua Portuguesa', weight: 2, topicsCount: 16 },
      { name: 'Direito Constitucional', weight: 2, topicsCount: 12 },
      { name: 'Direito Administrativo', weight: 2, topicsCount: 14 },
      { name: 'Raciocínio Lógico-Matemático', weight: 1, topicsCount: 9 },
      { name: 'Noções de Informática', weight: 1, topicsCount: 11 },
    ],
  },
  'tjsp-escrevente-tecnico-judiciario-2026': {
    title: 'Edital TJ-SP 2026 — Escrevente Técnico Judiciário',
    institution: 'Tribunal de Justiça de São Paulo (TJ-SP)',
    banca: 'Vunesp',
    role: 'Escrevente Técnico Judiciário',
    salary: 'R$ 7.250,00 + Auxílios',
    vacancies: 560,
    examDate: 'Novembro de 2026',
    subjects: [
      { name: 'Língua Portuguesa', weight: 3, topicsCount: 24 },
      { name: 'Normas da Corregedoria Geral da Justiça', weight: 3, topicsCount: 15 },
      { name: 'Direito Constitucional e Administrativo', weight: 2, topicsCount: 18 },
      { name: 'Direito Processual Civil e Penal', weight: 2, topicsCount: 22 },
      { name: 'Atualidades e Estatuto da Pessoa com Deficiência', weight: 1, topicsCount: 8 },
      { name: 'Matemática e Raciocínio Lógico', weight: 1, topicsCount: 10 },
    ],
  },
  'prf-policial-rodoviario-federal-2026': {
    title: 'Edital PRF 2026 — Policial Rodoviário Federal',
    institution: 'Polícia Rodoviária Federal (PRF)',
    banca: 'Cebraspe',
    role: 'Policial Rodoviário Federal',
    salary: 'R$ 10.742,00 + Adicionais',
    vacancies: 800,
    examDate: 'Dezembro de 2026',
    subjects: [
      { name: 'Legislação de Trânsito (CTB & Resoluções Contran)', weight: 3, topicsCount: 45 },
      { name: 'Língua Portuguesa', weight: 2, topicsCount: 20 },
      { name: 'Noções de Direito Penal e Processual Penal', weight: 2, topicsCount: 26 },
      { name: 'Direito Constitucional e Direitos Humanos', weight: 2, topicsCount: 18 },
      { name: 'Física Aplicada', weight: 1, topicsCount: 12 },
      { name: 'Geopolítica Brasileira & Informática', weight: 1, topicsCount: 14 },
    ],
  },
  'oab-43-exame-de-ordem-2026': {
    title: 'OAB 43º Exame de Ordem Unificado (2026)',
    institution: 'Ordem dos Advogados do Brasil (CFOAB)',
    banca: 'FGV Concursos',
    role: 'Advogado (Inscrição nos Quadros)',
    salary: 'Habilitação Profissional Privativa',
    vacancies: 9999,
    examDate: 'Julho de 2026',
    subjects: [
      { name: 'Ética Profissional e Estatuto da OAB', weight: 3, topicsCount: 18 },
      { name: 'Direito Constitucional', weight: 2, topicsCount: 22 },
      { name: 'Direito Civil e Processo Civil', weight: 3, topicsCount: 36 },
      { name: 'Direito Penal e Processo Penal', weight: 2, topicsCount: 30 },
      { name: 'Direito do Trabalho e Processo do Trabalho', weight: 2, topicsCount: 20 },
      { name: 'Direito Administrativo e Tributário', weight: 2, topicsCount: 24 },
    ],
  },
};

export async function generateMetadata({ params }: EditalPageProps): Promise<Metadata> {
  const edital = EDITAIS_CATALOG[params.slug] || {
    title: `Edital Verticalizado e Cronograma de Estudos — ${params.slug.replace(/-/g, ' ').toUpperCase()}`,
    institution: 'Concurso Público Oficial',
    banca: 'Banca Examinadora',
  };

  return {
    title: `${edital.title} | AprovaLens AI`,
    description: `Dissecação completa do ${edital.title}. Baixe o edital verticalizado em PDF gratuito com mapa de calor das matérias mais cobradas pela banca ${edital.banca}.`,
    openGraph: {
      title: `${edital.title} | Edital Verticalizado por IA`,
      description: `Prepare-se com foco cirúrgico nos tópicos de maior peso da banca ${edital.banca}. Baixe o cronograma estratégico gratuito.`,
      url: `https://aprovalens.ai/edital/${params.slug}`,
    },
  };
}

export default function EditalPublicPage({ params }: EditalPageProps) {
  const edital = EDITAIS_CATALOG[params.slug] || {
    title: `Edital Verticalizado — ${params.slug.replace(/-/g, ' ').toUpperCase()}`,
    institution: 'Concurso Público 2026',
    banca: 'Cebraspe / FGV / Vunesp',
    role: 'Cargo em Disputa',
    salary: 'A Definir em Edital',
    vacancies: 100,
    examDate: 'Segundo Semestre 2026',
    subjects: [
      { name: 'Língua Portuguesa', weight: 3, topicsCount: 18 },
      { name: 'Direito Constitucional', weight: 2, topicsCount: 14 },
      { name: 'Direito Administrativo', weight: 2, topicsCount: 16 },
      { name: 'Raciocínio Lógico', weight: 1, topicsCount: 10 },
      { name: 'Conhecimentos Específicos do Cargo', weight: 3, topicsCount: 32 },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#0e1424]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg text-white tracking-tight">
              Aprova<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Lens</span>
            </span>
          </Link>

          <Link 
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Acessar Plataforma Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {/* Badge & Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Edital Verticalizado por IA
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400">Banca {edital.banca}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
          {edital.title}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mb-8 leading-relaxed">
          Dissecação cirúrgica de todas as matérias, pesos e incidência estatística da banca. Baixe a planilha verticalizada e ative o cronograma adaptativo.
        </p>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Instituição</span>
            <span className="text-sm font-extrabold text-white truncate block">{edital.institution}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Remuneração</span>
            <span className="text-sm font-extrabold text-emerald-400 block">{edital.salary}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Vagas Estimadas</span>
            <span className="text-sm font-extrabold text-cyan-400 block">{edital.vacancies} Vagas</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Data da Prova</span>
            <span className="text-sm font-extrabold text-amber-400 block">{edital.examDate}</span>
          </div>
        </div>

        {/* Grid: Subjects Table & Lead Magnet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Subjects Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-[#11182c] border border-white/5 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Matérias & Distribuição de Pesos ({edital.banca})
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Ordenado por prioridade algorítmica para o ciclo de estudos de alto rendimento.
              </p>

              <div className="space-y-3">
                {edital.subjects.map((sub, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-[#0a0f1d] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 font-mono">0{idx + 1}</span>
                        <h3 className="text-sm font-bold text-white">{sub.name}</h3>
                      </div>
                      <span className="text-xs text-slate-400 ml-6 block mt-0.5">
                        {sub.topicsCount} tópicos mapeados no edital
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                        sub.weight === 3 
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                          : sub.weight === 2
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        Peso {sub.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Lead Magnet Form */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#16203a] to-[#0f172a] border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
              <Download className="w-3.5 h-3.5" />
              <span>Download 100% Gratuito</span>
            </div>

            <h3 className="text-xl font-black text-white mb-2 leading-snug">
              Baixe o Edital Verticalizado em PDF
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Receba no seu e-mail a planilha completa com controle de revisões, horas estudadas e questões por tópico.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Pronto! O link para download do edital verticalizado e acesso ao simulador foi enviado!');
                window.location.href = '/';
              }} 
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seu Nome</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Lucas Barbosa" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Melhor E-mail</label>
                <input 
                  type="email" 
                  required 
                  placeholder="seu@email.com" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  placeholder="(11) 99999-9999" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Receber Edital no WhatsApp & E-mail</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sem spam. Seus dados estão 100% seguros.</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
