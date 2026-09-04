import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  DollarSign, 
  Users, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  ChevronRight,
  HelpCircle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { 
  EDITAIS_CATALOG, 
  getEditalBySlug, 
  getAllEditalSlugs,
  EditalCatalogItem 
} from '@/lib/editaisCatalog';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

interface EditalPageProps {
  params: {
    slug: string;
  };
}

// 1. Pré-renderização Estática (SSG) de todas as URLs para máxima velocidade e SEO
export async function generateStaticParams() {
  const slugs = getAllEditalSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 2. Metadados dinâmicos e OpenGraph para indexação do Google
export async function generateMetadata({ params }: EditalPageProps): Promise<Metadata> {
  const edital = getEditalBySlug(params.slug);

  if (!edital) {
    return {
      title: 'Edital Verticalizado | AprovaLens AI',
      description: 'Dissecação cirúrgica de editais com inteligência artificial para concursos públicos.',
    };
  }

  const pageUrl = `https://aprovalens.ai/edital/${edital.slug}`;

  return {
    title: `${edital.title} — Baixar Edital Verticalizado Grátis`,
    description: `Baixe a planilha do ${edital.title} em PDF e Excel. Mapeamento de matérias com maior incidência da banca ${edital.banca}, pesos, e cronograma de revisões espaçadas por IA.`,
    keywords: [
      edital.title,
      `edital verticalizado ${edital.institution}`,
      `concurso ${edital.institution} 2026`,
      `banca ${edital.banca}`,
      'cronograma de estudos',
      'planilha de estudos pdf',
      'AprovaLens AI'
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${edital.title} | Edital Esquematizado por IA`,
      description: `Dissecação completa do edital ${edital.institution}. Baixe a planilha verticalizada com ciclo de estudos adaptativo.`,
      url: pageUrl,
      type: 'article',
      locale: 'pt_BR',
      siteName: 'AprovaLens AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: edital.title,
      description: `Prepare-se com foco cirúrgico nos tópicos de maior peso da banca ${edital.banca}.`,
    },
  };
}

export default function EditalPublicPage({ params }: EditalPageProps) {
  const edital = getEditalBySlug(params.slug);

  if (!edital) {
    notFound();
  }

  // Editais relacionados para links internos de SEO
  const relatedEditais = Object.values(EDITAIS_CATALOG)
    .filter((item) => item.slug !== edital.slug)
    .slice(0, 4);

  // Schema.org Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOccupationalProgram',
        name: edital.title,
        description: edital.summary,
        provider: {
          '@type': 'Organization',
          name: 'AprovaLens AI',
          url: 'https://aprovalens.ai',
        },
        educationalCredentialAwarded: edital.role,
        timeToComplete: 'P6M',
      },
      {
        '@type': 'FAQPage',
        mainEntity: edital.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: 'https://aprovalens.ai',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Editais Verticalizados',
            item: 'https://aprovalens.ai/edital',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: edital.title,
            item: `https://aprovalens.ai/edital/${edital.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#0e1424]/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] glow-brand">
              <div className="w-full h-full bg-[#0e1424] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-black text-lg text-white tracking-tight">
              Aprova<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Lens</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Ver Plataforma
            </Link>
            <Link
              href={`/?edital=${edital.slug}&tab=edital`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5"
            >
              <span>Simulador com IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-indigo-400 transition-colors">Início</Link>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-slate-400 shrink-0">Editais</span>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-indigo-400 font-semibold truncate">{edital.institution}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Edital Verticalizado Oficial
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Banca {edital.banca}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Atualizado 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {edital.title}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {edital.summary} Baixe a planilha verticalizada com distribuição de pesos, taxa de incidência estatística da banca <strong>{edital.banca}</strong> e colunas prontas para ciclo de estudos e revisões espaçadas.
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Banca Examinadora</span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white truncate block">{edital.banca}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Remuneração Inicial</span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 truncate block">{edital.salary}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Vagas Previstas</span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-cyan-400 block">{edital.vacancies} Vagas</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11182c] border border-white/5 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Previsão da Prova</span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-amber-400 truncate block">{edital.examDate}</span>
          </div>
        </div>

        {/* 2-Column Section: Syllabus Matrix & Lead Capture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
          
          {/* Left Column: Subjects & Key Topics Matrix */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#11182c] border border-white/5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>Conteúdo Programático Dissecado por Relevância</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Pesos atribuídos pelo algoritmo da AprovaLens com base no histórico da banca <strong>{edital.banca}</strong>.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 shrink-0 self-start">
                  {edital.subjects.length} Disciplinas Mapeadas
                </span>
              </div>

              <div className="space-y-4">
                {edital.subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-white/5 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-white/5 text-slate-400 text-xs font-bold font-mono flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {sub.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                          sub.priority === 'alta'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : sub.priority === 'media'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          Prioridade {sub.priority}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-white/5">
                          Peso {sub.weight} • {sub.topicsCount} tópicos
                        </span>
                      </div>
                    </div>

                    {/* Tópicos com Maior Incidência */}
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Tópicos Críticos para Gabaritar:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.keyTopics.map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 hover:border-indigo-500/30 transition-colors"
                          >
                            ✓ {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Card */}
          <div className="lg:sticky lg:top-20">
            <LeadCaptureForm edital={edital} />
          </div>

        </div>

        {/* FAQ Section (Rich Snippets for Google) */}
        {edital.faq && edital.faq.length > 0 && (
          <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#11182c] border border-white/5 shadow-xl">
            <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-white/5">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Dúvidas Frequentes sobre o Concurso e o Edital
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {edital.faq.map((faqItem, fIdx) => (
                <div 
                  key={fIdx}
                  className="p-5 rounded-2xl bg-[#0a0f1d] border border-white/5 space-y-2"
                >
                  <h3 className="text-sm font-bold text-white flex items-start gap-2">
                    <span className="text-indigo-400 font-mono">Q.</span>
                    <span>{faqItem.question}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pl-5">
                    {faqItem.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Editais Section (SEO Internal Linking) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#11182c]/70 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">
                Outros Editais em Destaque para 2026
              </h2>
            </div>
            <Link 
              href="/" 
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedEditais.map((rel, rIdx) => (
              <Link
                key={rIdx}
                href={`/edital/${rel.slug}`}
                className="p-4 rounded-2xl bg-[#0a0f1d] border border-white/5 hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                    <span>{rel.banca}</span>
                    <span className="text-emerald-400 font-bold">{rel.vacancies} vagas</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[120px]">{rel.salary}</span>
                  <span className="text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Acessar &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-[#0a0f1d] text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 AprovaLens AI • Tecnologia Cognitiva para Aprovação em Concursos.</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Editais verticalizados baseados nas publicações oficiais dos órgãos examinadores.
          </p>
        </div>
      </footer>
    </div>
  );
}
