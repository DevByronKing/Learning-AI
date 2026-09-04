'use client';

import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Users, 
  Award, 
  BookOpen, 
  Layers, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  ExternalLink, 
  Flame, 
  FileCheck,
  FileText,
  UploadCloud,
  X,
  Plus,
  Check
} from 'lucide-react';
import { ExamNotice, ExamSubject } from '@/lib/types';
import { INITIAL_EXAMS } from '@/lib/mockData';
import { getStatusColor } from '@/lib/utils';

interface EditalParserProps {
  exams: ExamNotice[];
  selectedExam: ExamNotice;
  onSelectExam: (exam: ExamNotice) => void;
  onGenerateCycle: (exam: ExamNotice) => void;
  onAddCustomExam: (newExam: ExamNotice) => void;
}

// Helper to generate realistic, area-specific syllabus based on file keywords
const generateSyllabusByArea = (
  title: string,
  role: string,
  rawText: string
): ExamSubject[] => {
  const combined = (title + ' ' + role + ' ' + rawText).toLowerCase();

  if (
    combined.includes('polic') ||
    combined.includes('prf') ||
    combined.includes('pf') ||
    combined.includes('seguranc') ||
    combined.includes('penal') ||
    combined.includes('agente') ||
    combined.includes('escriv') ||
    combined.includes('delegad')
  ) {
    return [
      {
        id: `sub-${Date.now()}-1`,
        name: 'Direito Penal & Legislação Especial Extravagante',
        weight: 3,
        relevancePercentage: 40,
        totalTopics: 4,
        topics: [
          { id: 't-pol-1', name: 'Crimes Contra o Patrimônio e a Administração Pública', frequencyInBanca: 'Alta', accuracyRate: 52, status: 'Ponto Cego', articlesOrLaws: ['Arts. 155-180, 312-327 do CP'] },
          { id: 't-pol-2', name: 'Lei de Drogas (Lei 11.343/06) & Tráfico Privilegiado', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado', articlesOrLaws: ['Lei 11.343/06'] },
          { id: 't-pol-3', name: 'Estatuto do Desarmamento & Posse/Porte de Arma', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável', articlesOrLaws: ['Lei 10.826/03'] },
          { id: 't-pol-4', name: 'Abuso de Autoridade & Pacote Anticrime', frequencyInBanca: 'Média', accuracyRate: 48, status: 'Ponto Cego', articlesOrLaws: ['Lei 13.869/19', 'Lei 13.964/19'] }
        ]
      },
      {
        id: `sub-${Date.now()}-2`,
        name: 'Direito Processual Penal & Perícia',
        weight: 3,
        relevancePercentage: 30,
        totalTopics: 3,
        topics: [
          { id: 't-pol-5', name: 'Inquérito Policial (Características e Sigilo)', frequencyInBanca: 'Alta', accuracyRate: 80, status: 'Dominado', articlesOrLaws: ['Arts. 4º a 23 do CPP'] },
          { id: 't-pol-6', name: 'Prisão em Flagrante, Preventiva e Liberdade Provisória', frequencyInBanca: 'Alta', accuracyRate: 55, status: 'Instável', articlesOrLaws: ['Arts. 310-313 do CPP'] },
          { id: 't-pol-7', name: 'Cadeia de Custódia e Teoria Geral das Provas', frequencyInBanca: 'Alta', accuracyRate: 40, status: 'Ponto Cego', articlesOrLaws: ['Art. 158-A do CPP'] }
        ]
      },
      {
        id: `sub-${Date.now()}-3`,
        name: combined.includes('prf') ? 'Legislação de Trânsito (CTB)' : 'Informática Aplicada & Segurança Cibernética',
        weight: 2,
        relevancePercentage: 18,
        totalTopics: 2,
        topics: [
          { id: 't-pol-8', name: combined.includes('prf') ? 'Normas Gerais de Circulação e Conduta no CTB' : 'Redes de Comunicação, Ransomware e Criptografia', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Instável', articlesOrLaws: combined.includes('prf') ? ['Arts. 26 a 67 do CTB'] : undefined },
          { id: 't-pol-9', name: combined.includes('prf') ? 'Crimes de Trânsito e Embriaguez ao Volante' : 'Bancos de Dados, SQL e Python Básico', frequencyInBanca: 'Média', accuracyRate: 70, status: 'Dominado', articlesOrLaws: combined.includes('prf') ? ['Art. 306 do CTB'] : undefined }
        ]
      },
      {
        id: `sub-${Date.now()}-4`,
        name: 'Língua Portuguesa & Redação Oficial',
        weight: 1,
        relevancePercentage: 12,
        totalTopics: 2,
        topics: [
          { id: 't-pol-10', name: 'Interpretação e Inferência Textual (Padrão da Banca)', frequencyInBanca: 'Alta', accuracyRate: 65, status: 'Instável' },
          { id: 't-pol-11', name: 'Sintaxe de Concordância, Regência e Crase', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado' }
        ]
      }
    ];
  }

  if (
    combined.includes('fiscal') ||
    combined.includes('receita') ||
    combined.includes('tribut') ||
    combined.includes('sefaz') ||
    combined.includes('iss') ||
    combined.includes('auditor')
  ) {
    return [
      {
        id: `sub-${Date.now()}-1`,
        name: 'Direito Tributário & Sistema Constitucional Tributário',
        weight: 3,
        relevancePercentage: 35,
        totalTopics: 3,
        topics: [
          { id: 't-fis-1', name: 'Competência Tributária e Limitações ao Poder de Tributar', frequencyInBanca: 'Alta', accuracyRate: 58, status: 'Instável', articlesOrLaws: ['Arts. 145 a 156 da CF/88'] },
          { id: 't-fis-2', name: 'Obrigação Tributária e Hipótese de Incidência', frequencyInBanca: 'Alta', accuracyRate: 72, status: 'Dominado', articlesOrLaws: ['Arts. 113 a 127 do CTN'] },
          { id: 't-fis-3', name: 'Suspensão, Extinção e Exclusão do Crédito Tributário', frequencyInBanca: 'Alta', accuracyRate: 44, status: 'Ponto Cego', articlesOrLaws: ['Arts. 151 a 182 do CTN'] }
        ]
      },
      {
        id: `sub-${Date.now()}-2`,
        name: 'Contabilidade Geral & Avançada',
        weight: 3,
        relevancePercentage: 35,
        totalTopics: 3,
        topics: [
          { id: 't-fis-4', name: 'Pronunciamento Técnico CPC 00 (Estrutura Conceitual)', frequencyInBanca: 'Alta', accuracyRate: 46, status: 'Ponto Cego' },
          { id: 't-fis-5', name: 'Balanço Patrimonial e Avaliação de Investimentos', frequencyInBanca: 'Alta', accuracyRate: 68, status: 'Instável' },
          { id: 't-fis-6', name: 'Demonstração dos Fluxos de Caixa (DFC) e DVA', frequencyInBanca: 'Média', accuracyRate: 82, status: 'Dominado' }
        ]
      },
      {
        id: `sub-${Date.now()}-3`,
        name: 'Auditoria & Legislação Tributária Aduaneira',
        weight: 2,
        relevancePercentage: 18,
        totalTopics: 2,
        topics: [
          { id: 't-fis-7', name: 'Procedimentos de Auditoria e Testes Substantivos', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Instável' },
          { id: 't-fis-8', name: 'Infrações e Penalidades Fiscais Aduaneiras', frequencyInBanca: 'Média', accuracyRate: 50, status: 'Ponto Cego' }
        ]
      },
      {
        id: `sub-${Date.now()}-4`,
        name: 'Língua Portuguesa & RLM',
        weight: 1,
        relevancePercentage: 12,
        totalTopics: 2,
        topics: [
          { id: 't-fis-9', name: 'Lógica Proposicional e Equivalências Lógicas', frequencyInBanca: 'Alta', accuracyRate: 70, status: 'Instável' },
          { id: 't-fis-10', name: 'Coesão Textual e Reescritura de Frases', frequencyInBanca: 'Alta', accuracyRate: 88, status: 'Dominado' }
        ]
      }
    ];
  }

  if (
    combined.includes('tribunal') ||
    combined.includes('tj') ||
    combined.includes('trt') ||
    combined.includes('trf') ||
    combined.includes('tre') ||
    combined.includes('judic') ||
    combined.includes('oab') ||
    combined.includes('direito')
  ) {
    return [
      {
        id: `sub-${Date.now()}-1`,
        name: 'Direito Processual Civil (CPC/2015)',
        weight: 3,
        relevancePercentage: 35,
        totalTopics: 3,
        topics: [
          { id: 't-jud-1', name: 'Tutelas Provisórias de Urgência e Evidência', frequencyInBanca: 'Alta', accuracyRate: 48, status: 'Ponto Cego', articlesOrLaws: ['Arts. 294 a 311 do CPC'] },
          { id: 't-jud-2', name: 'Atos Processuais, Prazos e Citações', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado', articlesOrLaws: ['Arts. 212 a 250 do CPC'] },
          { id: 't-jud-3', name: 'Sistema Recursal: Apelação e Agravo de Instrumento', frequencyInBanca: 'Alta', accuracyRate: 58, status: 'Instável', articlesOrLaws: ['Arts. 994 a 1.044 do CPC'] }
        ]
      },
      {
        id: `sub-${Date.now()}-2`,
        name: 'Direito Constitucional Aplicado',
        weight: 2,
        relevancePercentage: 25,
        totalTopics: 2,
        topics: [
          { id: 't-jud-4', name: 'Controle de Constitucionalidade (Difuso e Concentrado)', frequencyInBanca: 'Alta', accuracyRate: 45, status: 'Ponto Cego', articlesOrLaws: ['Art. 102 da CF/88'] },
          { id: 't-jud-5', name: 'Funções Essenciais à Justiça e Poder Judiciário', frequencyInBanca: 'Alta', accuracyRate: 82, status: 'Dominado', articlesOrLaws: ['Arts. 92 a 135 da CF/88'] }
        ]
      },
      {
        id: `sub-${Date.now()}-3`,
        name: 'Direito Administrativo & Legislação dos Tribunais',
        weight: 2,
        relevancePercentage: 25,
        totalTopics: 2,
        topics: [
          { id: 't-jud-6', name: 'Nova Lei de Licitações e Contratos Administrativos', frequencyInBanca: 'Alta', accuracyRate: 52, status: 'Instável', articlesOrLaws: ['Lei 14.133/21'] },
          { id: 't-jud-7', name: 'Regime Disciplinar dos Servidores e Lei de Improbidade', frequencyInBanca: 'Alta', accuracyRate: 70, status: 'Instável', articlesOrLaws: ['Lei 8.112/90', 'Lei 8.429/92'] }
        ]
      },
      {
        id: `sub-${Date.now()}-4`,
        name: 'Língua Portuguesa & Redação Oficial',
        weight: 1,
        relevancePercentage: 15,
        totalTopics: 2,
        topics: [
          { id: 't-jud-8', name: 'Interpretação Textual & Redação Oficial Forense', frequencyInBanca: 'Alta', accuracyRate: 78, status: 'Dominado' },
          { id: 't-jud-9', name: 'Crase, Regência e Pontuação Estilística', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável' }
        ]
      }
    ];
  }

  // Default / Geral
  return [
    {
      id: `sub-${Date.now()}-1`,
      name: 'Conhecimentos Específicos & Legislação Aplicada',
      weight: 3,
      relevancePercentage: 45,
      totalTopics: 3,
      topics: [
        { id: 't-gen-1', name: 'Normas Específicas do Órgão e Legislação Setorial', frequencyInBanca: 'Alta', accuracyRate: 50, status: 'Ponto Cego', articlesOrLaws: ['Legislação do Edital'] },
        { id: 't-gen-2', name: 'Processo Administrativo e Acesso à Informação', frequencyInBanca: 'Alta', accuracyRate: 68, status: 'Instável', articlesOrLaws: ['Lei 9.784/99', 'Lei 12.527/11'] },
        { id: 't-gen-3', name: 'Ética no Serviço Público e Decretos Regulamentares', frequencyInBanca: 'Média', accuracyRate: 85, status: 'Dominado', articlesOrLaws: ['Decreto 1.171/94'] }
      ]
    },
    {
      id: `sub-${Date.now()}-2`,
      name: 'Direito Constitucional & Administrativo',
      weight: 2,
      relevancePercentage: 30,
      totalTopics: 3,
      topics: [
        { id: 't-gen-4', name: 'Direitos e Garantias Fundamentais (Art. 5º da CF)', frequencyInBanca: 'Alta', accuracyRate: 82, status: 'Dominado', articlesOrLaws: ['Art. 5º, CF/88'] },
        { id: 't-gen-5', name: 'Regime Jurídico Único dos Servidores Públicos', frequencyInBanca: 'Alta', accuracyRate: 62, status: 'Instável', articlesOrLaws: ['Lei 8.112/90'] },
        { id: 't-gen-6', name: 'Atos Administrativos e Poderes da Administração', frequencyInBanca: 'Alta', accuracyRate: 48, status: 'Ponto Cego', articlesOrLaws: ['Doutrina Administrativa'] }
      ]
    },
    {
      id: `sub-${Date.now()}-3`,
      name: 'Língua Portuguesa & Redação Oficial',
      weight: 1,
      relevancePercentage: 15,
      totalTopics: 2,
      topics: [
        { id: 't-gen-7', name: 'Compreensão e Interpretação de Textos da Banca', frequencyInBanca: 'Alta', accuracyRate: 72, status: 'Instável' },
        { id: 't-gen-8', name: 'Morfossintaxe, Pontuação e Crase', frequencyInBanca: 'Alta', accuracyRate: 86, status: 'Dominado' }
      ]
    },
    {
      id: `sub-${Date.now()}-4`,
      name: 'Raciocínio Lógico & Noções de Tecnologia',
      weight: 1,
      relevancePercentage: 10,
      totalTopics: 2,
      topics: [
        { id: 't-gen-9', name: 'Lógica Sentencial e Proposições Compostas', frequencyInBanca: 'Média', accuracyRate: 58, status: 'Instável' },
        { id: 't-gen-10', name: 'Segurança da Informação e Ferramentas Digitais', frequencyInBanca: 'Média', accuracyRate: 75, status: 'Dominado' }
      ]
    }
  ];
};

export const EditalParser: React.FC<EditalParserProps> = ({
  exams,
  selectedExam,
  onSelectExam,
  onGenerateCycle,
  onAddCustomExam
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(selectedExam.subjects[0]?.id || null);
  
  // Custom Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [examTitleInput, setExamTitleInput] = useState('');
  const [bancaInput, setBancaInput] = useState<'FGV' | 'Cebraspe' | 'FCC' | 'Vunesp' | 'Outra'>('Cebraspe');
  const [roleInput, setRoleInput] = useState('');
  const [salaryInput, setSalaryInput] = useState('R$ 8.520,00');
  const [vacanciesInput, setVacanciesInput] = useState('180');
  const [uploadText, setUploadText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    `Lendo estrutura de "${uploadedFile?.name || 'Edital'}" e aplicando OCR inteligente...`,
    `Mapeando cargos, pesos das disciplinas e perfil estatístico da banca ${bancaInput}...`,
    'Estruturando árvore de conteúdos com artigos de lei pertinentes...',
    'Ponderando relevância estatística na banca e gerando edital verticalizado...'
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    if (!file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setUploadError('Por favor, selecione um arquivo em formato PDF, DOCX ou TXT.');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('O arquivo excede o limite máximo de 50MB.');
      return;
    }

    setUploadedFile(file);

    // Clean up filename to deduce title
    const cleanBaseName = file.name
      .replace(/\.(pdf|docx?|txt)$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    const lowerName = cleanBaseName.toLowerCase();
    let detectedBanca: 'FGV' | 'Cebraspe' | 'FCC' | 'Vunesp' | 'Outra' = 'Cebraspe';
    if (lowerName.includes('fgv') || lowerName.includes('getulio')) {
      detectedBanca = 'FGV';
    } else if (lowerName.includes('fcc') || lowerName.includes('carlos chagas')) {
      detectedBanca = 'FCC';
    } else if (lowerName.includes('vunesp')) {
      detectedBanca = 'Vunesp';
    } else if (lowerName.includes('cebraspe') || lowerName.includes('cespe')) {
      detectedBanca = 'Cebraspe';
    }

    let detectedRole = 'Analista / Técnico';
    if (lowerName.includes('auditor')) detectedRole = 'Auditor Fiscal';
    else if (lowerName.includes('agente')) detectedRole = 'Agente de Polícia';
    else if (lowerName.includes('escrivao') || lowerName.includes('escrivão')) detectedRole = 'Escrivão de Polícia';
    else if (lowerName.includes('perito')) detectedRole = 'Perito Criminal';
    else if (lowerName.includes('delegado')) detectedRole = 'Delegado de Polícia';
    else if (lowerName.includes('advogado') || lowerName.includes('oab')) detectedRole = 'Advogado / OAB';
    else if (lowerName.includes('bancario') || lowerName.includes('escriturario')) detectedRole = 'Escriturário / Caixa';
    else if (lowerName.includes('analista')) detectedRole = 'Analista Judiciário';

    setBancaInput(detectedBanca);
    setRoleInput((prev) => prev || detectedRole);
    setExamTitleInput((prev) => prev || (cleanBaseName.charAt(0).toUpperCase() + cleanBaseName.slice(1)));

    // If it is a text file, preview text
    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content && !uploadText) {
          setUploadText(content.slice(0, 3000));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    // Validate that either a file, title or text was supplied
    if (!uploadedFile && !examTitleInput.trim() && !uploadText.trim()) {
      setUploadError('Por favor, selecione um arquivo PDF ou informe o título/conteúdo do edital.');
      return;
    }

    const finalTitle = examTitleInput.trim() || (uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, '') : 'Edital Analisado por IA');
    const finalRole = roleInput.trim() || 'Analista / Técnico';
    const finalBanca = bancaInput;
    const finalSalary = salaryInput.trim() || 'R$ 8.520,00';
    const finalVacancies = parseInt(vacanciesInput) || 200;
    const finalFileName = uploadedFile?.name || 'Edital_Upload_Consolidado.pdf';

    setIsProcessing(true);
    setShowUploadModal(false);
    setProgressStage(0);

    const interval = setInterval(() => {
      setProgressStage((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);

            const dynamicSubjects = generateSyllabusByArea(finalTitle, finalRole, uploadText);

            const newExam: ExamNotice = {
              id: `custom-exam-${Date.now()}`,
              title: finalTitle,
              institution: finalTitle.split(' - ')[0] || 'Órgão Concursal',
              banca: finalBanca,
              role: finalRole,
              salary: finalSalary,
              vacancies: finalVacancies,
              examDate: '2026-12-15',
              daysRemaining: 105,
              pdfFileName: finalFileName,
              uploadedAt: new Date().toISOString().split('T')[0],
              subjects: dynamicSubjects
            };

            onAddCustomExam(newExam);
            onSelectExam(newExam);

            // Clean up state
            setUploadedFile(null);
            setExamTitleInput('');
            setRoleInput('');
            setUploadText('');
          }, 600);
          return 3;
        }
        return prev + 1;
      });
    }, 700);
  };

  const getExamArea = (exam: ExamNotice): string => {
    const combined = (exam.title + ' ' + exam.institution + ' ' + exam.role).toLowerCase();
    if (combined.includes('tribunal') || combined.includes('tj') || combined.includes('trt') || combined.includes('trf')) return 'Tribunais';
    if (combined.includes('polic') || combined.includes('pf') || combined.includes('prf') || combined.includes('depen')) return 'Policial';
    if (combined.includes('fiscal') || combined.includes('sefaz') || combined.includes('receita') || combined.includes('iss')) return 'Fiscal';
    if (combined.includes('oab') || combined.includes('advoga')) return 'Jurídica / OAB';
    return 'Geral / Administrativo';
  };

  const examsByArea = exams.reduce((acc, exam) => {
    const area = getExamArea(exam);
    if (!acc[area]) acc[area] = [];
    acc[area].push(exam);
    return acc;
  }, {} as Record<string, ExamNotice[]>);

  const filteredSubjects = selectedExam.subjects.map((sub) => ({
    ...sub,
    topics: sub.topics.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((sub) => sub.topics.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Preset Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-300 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              Motor de IA Multimodal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">PDF RAG Parser v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Dissecador de Editais & Edital Verticalizado
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Carregue qualquer edital em PDF ou selecione um concurso oficial pré-analisado para montar sua rota adaptativa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all glow-brand"
          >
            <FileUp className="w-4 h-4" />
            <span>Fazer Upload de Novo Edital</span>
          </button>
        </div>
      </div>

      {/* Selector of Pre-Analyzed Editais */}
      <div className="mt-6 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Editais Cadastrados por Área
          </span>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-dashed border-indigo-500/40 text-indigo-400 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload de Novo Edital (PDF)</span>
          </button>
        </div>

        <div className="space-y-5">
          {Object.entries(examsByArea).map(([area, areaExams]) => (
            <div key={area}>
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                {area}
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                {areaExams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => onSelectExam(exam)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      selectedExam.id === exam.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                        : 'bg-slate-50 dark:bg-dark-surface/80 hover:bg-slate-100 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span>{exam.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      selectedExam.id === exam.id ? 'bg-black/30 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {exam.banca}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Processing Animation Overlay */}
      {isProcessing && (
        <div className="mt-8 p-8 rounded-3xl glass-panel border border-indigo-500/40 glow-brand text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Processamento e Dissecação Analítica do Edital</h3>
          <p className="text-xs text-indigo-300 mt-1 font-mono">{stages[progressStage]}</p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mt-6 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${((progressStage + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Exam Overview Summary Card */}
      {!isProcessing && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          <div className="lg:col-span-3 glass-panel p-6 rounded-3xl border border-slate-300 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-300 dark:border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  {selectedExam.institution}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedExam.role}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedExam.pdfFileName || 'Edital_Oficial.pdf'}
                  </span>
                  <span>•</span>
                  <span>Banca: <strong className="text-slate-900 dark:text-white">{selectedExam.banca}</strong></span>
                </div>
              </div>

              <button
                onClick={() => onGenerateCycle(selectedExam)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all glow-emerald"
              >
                <BookOpen className="w-4 h-4" />
                <span>Estruturar Ciclo de Estudos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-dark-card/70 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Data da Prova</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{selectedExam.examDate}</p>
                <p className="text-[10px] text-amber-400 font-bold">Faltam {selectedExam.daysRemaining} dias</p>
              </div>

              <div className="bg-white dark:bg-dark-card/70 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Remuneração</span>
                </div>
                <p className="text-sm font-black text-emerald-400 mt-1">{selectedExam.salary}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Inicial Bruto</p>
              </div>

              <div className="bg-white dark:bg-dark-card/70 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vagas</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{selectedExam.vacancies} vagas</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Imediatas + CR</p>
              </div>

              <div className="bg-white dark:bg-dark-card/70 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Disciplinas</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{selectedExam.subjects.length} Matérias</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Ponderadas por peso</p>
              </div>
            </div>

          </div>

          {/* Banca Weight Distribution Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-300 dark:border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Distribuição Estatística da Prova</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Relevância percentual de cada disciplina no cálculo da nota de corte:</p>
              
              <div className="mt-4 space-y-4 overflow-y-auto max-h-56 pr-2 custom-scrollbar">
                {selectedExam.subjects.map((sub) => (
                  <div key={sub.id} className="text-xs group">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{sub.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                          Peso {sub.weight}
                        </span>
                      </div>
                      <span className="font-black text-indigo-500 dark:text-indigo-400">{sub.relevancePercentage}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${sub.relevancePercentage}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-500 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>{sub.totalTopics} tópicos listados</span>
                      {sub.relevancePercentage >= 30 && <span className="text-amber-500 font-bold">Maior relevância</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Banca: <strong>{selectedExam.banca}</strong></span>
              <span className="text-emerald-400 font-bold">100% Mapeado</span>
            </div>
          </div>

        </div>
      )}

      {/* Search and Filter Topics in Edital */}
      {!isProcessing && (
        <div className="mt-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Conteúdo Programático Verticalizado com Diagnóstico</span>
            </h3>
            
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por tópico ou lei..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Subjects Accordion / List */}
          <div className="space-y-4">
            {filteredSubjects.map((sub) => (
              <div key={sub.id} className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                
                {/* Subject Header */}
                <div
                  onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-500/20">
                      P{sub.weight}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sub.topics.length} tópicos mapeados • Peso {sub.weight} ({sub.relevancePercentage}% da prova)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      Frequência {sub.topics[0]?.frequencyInBanca || 'Alta'}
                    </span>
                    {expandedSubject === sub.id ? (
                      <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Topics Breakdown */}
                {expandedSubject === sub.id && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-dark-card/30">
                    <div className="grid grid-cols-1 gap-2.5 mt-3">
                      {sub.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-3 rounded-xl bg-white dark:bg-dark-surface/60 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                        >
                          <div className="max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{topic.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(topic.status)}`}>
                                {topic.status}
                              </span>
                            </div>

                            {topic.articlesOrLaws && topic.articlesOrLaws.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {topic.articlesOrLaws.map((law, idx) => (
                                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                                    📜 {law}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {topic.accuracyRate !== undefined && (
                              <div className="text-right">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">Proficiência</p>
                                <p className={`text-xs font-bold ${topic.accuracyRate >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {topic.accuracyRate}%
                                </p>
                              </div>
                            )}
                            
                            <span className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                              Incidência {topic.frequencyInBanca}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Upload Custom Edital Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-xl p-6 rounded-3xl border border-indigo-500/40 relative glow-brand my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-300 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Carregar Novo Edital (PDF ou Documento)</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">A IA lerá seu arquivo e gerará o edital verticalizado em segundos</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError(null);
                }}
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="mt-5 space-y-4">
              
              {/* Drag and Drop Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Arquivo do Edital (PDF, DOCX ou TXT):
                </label>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {!uploadedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
                      isDragging
                        ? 'border-indigo-400 bg-indigo-500/20 scale-[0.99]'
                        : 'border-indigo-500/30 hover:border-indigo-400/70 bg-indigo-500/5 hover:bg-indigo-500/10'
                    }`}
                  >
                    <FileUp className="w-9 h-9 text-indigo-400 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                      Arraste e solte seu edital em PDF aqui
                    </p>
                    <p className="text-[11px] text-indigo-300/80 mt-1 font-medium">
                      ou clique aqui para buscar nos arquivos do seu computador
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-[10px] text-indigo-300 font-semibold">
                        PDF • DOCX • TXT (até 50MB)
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] text-emerald-300 font-semibold">
                        OCR com IA Integrada
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                            {uploadedFile.name}
                          </p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3" /> Anexado
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Tamanho: {formatFileSize(uploadedFile.size)} • Pronto para dissecação
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-indigo-300 transition-colors"
                      >
                        Trocar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center transition-colors"
                        title="Remover arquivo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contest Title / Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Título do Concurso / Órgão:
                </label>
                <input
                  type="text"
                  value={examTitleInput}
                  onChange={(e) => setExamTitleInput(e.target.value)}
                  placeholder="Ex: Polícia Federal 2026 - Agente, Receita Federal, OAB 41º..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white placeholder-slate-500"
                />
              </div>

              {/* Two Column Grid: Banca & Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Banca Examinadora:
                  </label>
                  <select
                    value={bancaInput}
                    onChange={(e) => setBancaInput(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white bg-white dark:bg-dark-surface cursor-pointer"
                  >
                    <option value="Cebraspe" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white">Cebraspe (Certo / Errado)</option>
                    <option value="FGV" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white">FGV (Múltipla Escolha - 5 Opções)</option>
                    <option value="FCC" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white">FCC (Fundação Carlos Chagas)</option>
                    <option value="Vunesp" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white">Vunesp</option>
                    <option value="Outra" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white">Outra Banca Examinadora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Cargo Pretendido:
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="Ex: Agente, Auditor, Técnico..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Two Column Grid: Salário & Vagas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Remuneração Estimada:
                  </label>
                  <input
                    type="text"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    placeholder="Ex: R$ 9.350,00"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Vagas Previstas:
                  </label>
                  <input
                    type="number"
                    value={vacanciesInput}
                    onChange={(e) => setVacanciesInput(e.target.value)}
                    placeholder="Ex: 250"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Optional Textarea for Content */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Anotações ou Conteúdo Programático Específico (Opcional):
                </label>
                <textarea
                  rows={3}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Se desejar, você também pode colar aqui trechos do edital, matérias específicas ou artigos de lei exigidos pela banca..."
                  className="w-full p-3 rounded-xl glass-input text-xs text-slate-900 dark:text-white placeholder-slate-500"
                />
              </div>

              {/* Error Banner */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-300 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all glow-brand"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dissecar Edital com IA</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
