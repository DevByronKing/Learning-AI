'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Database,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  FileCode,
  ArrowRight,
  ExternalLink,
  Info,
  Loader2,
  RefreshCw,
  UploadCloud,
  Trash2,
  Upload,
  FileType,
} from 'lucide-react';
import {
  ExamIngestionMetadata,
  ParsedExamQuestion,
  ExamIngestionResult,
} from '@/lib/types';
import {
  SAMPLE_CEBRASPE_PF_TEXT,
  SAMPLE_CEBRASPE_PF_KEY,
  SAMPLE_FGV_RECEITA_TEXT,
  SAMPLE_FGV_RECEITA_KEY,
} from './adminIngestSamples';

interface AdminQuestionIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsIngested?: (questions: ParsedExamQuestion[]) => void;
}

export const AdminQuestionIngestModal: React.FC<AdminQuestionIngestModalProps> = ({
  isOpen,
  onClose,
  onQuestionsIngested,
}) => {
  const [metadata, setMetadata] = useState<ExamIngestionMetadata>({
    title: 'Polícia Federal 2021 - Agente',
    banca: 'Cebraspe',
    institution: 'Polícia Federal',
    role: 'Agente de Polícia Federal',
    year: 2021,
    bookletColorOrCode: 'Caderno Branco',
    careerCategory: 'policial',
    sourceUrl: 'https://www.cebraspe.org.br/concursos/DPF_21_AGENTE',
  });

  // Estado dos Arquivos PDF
  const [examPdfFile, setExamPdfFile] = useState<{ name: string; size: string; base64?: string } | null>({
    name: 'PF_2021_Agente_Caderno_Branco.pdf',
    size: '1.4 MB',
  });
  const [answerKeyPdfFile, setAnswerKeyPdfFile] = useState<{ name: string; size: string; base64?: string } | null>({
    name: 'PF_2021_Agente_Gabarito_Definitivo.pdf',
    size: '280 KB',
  });

  // Fallback de texto caso o usuário queira inspecionar ou editar
  const [examText, setExamText] = useState(SAMPLE_CEBRASPE_PF_TEXT);
  const [answerKeyText, setAnswerKeyText] = useState(SAMPLE_CEBRASPE_PF_KEY);
  const [showManualTextToggle, setShowManualTextToggle] = useState(false);

  // Estados de processamento e auditoria
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ExamIngestionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'audit_preview' | 'sql_export'>('input');
  const [copiedSql, setCopiedSql] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs para inputs de arquivo invisíveis
  const examFileInputRef = useRef<HTMLInputElement>(null);
  const keyFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExamFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setExamPdfFile({
        name: file.name,
        size: sizeFormatted,
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleKeyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAnswerKeyPdfFile({
        name: file.name,
        size: sizeFormatted,
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const loadSampleCebraspe = () => {
    setMetadata({
      title: 'Polícia Federal 2021 - Agente',
      banca: 'Cebraspe',
      institution: 'Polícia Federal',
      role: 'Agente de Polícia Federal',
      year: 2021,
      bookletColorOrCode: 'Caderno Branco',
      careerCategory: 'policial',
      sourceUrl: 'https://www.cebraspe.org.br/concursos/DPF_21_AGENTE',
    });
    setExamPdfFile({
      name: 'PF_2021_Agente_Caderno_Branco.pdf',
      size: '1.4 MB',
    });
    setAnswerKeyPdfFile({
      name: 'PF_2021_Agente_Gabarito_Definitivo.pdf',
      size: '280 KB',
    });
    setExamText(SAMPLE_CEBRASPE_PF_TEXT);
    setAnswerKeyText(SAMPLE_CEBRASPE_PF_KEY);
    setResult(null);
    setActiveTab('input');
  };

  const loadSampleFgv = () => {
    setMetadata({
      title: 'Receita Federal 2023 - Auditor-Fiscal',
      banca: 'FGV',
      institution: 'Receita Federal do Brasil',
      role: 'Auditor-Fiscal da RFB',
      year: 2023,
      bookletColorOrCode: 'Tipo 1 - Branca',
      careerCategory: 'fiscal',
      sourceUrl: 'https://conhecimento.fgv.br/concursos/rfb22',
    });
    setExamPdfFile({
      name: 'Receita_Federal_2023_Auditor_Tipo1.pdf',
      size: '2.1 MB',
    });
    setAnswerKeyPdfFile({
      name: 'Receita_2023_Gabarito_Definitivo_PosRecursos.pdf',
      size: '340 KB',
    });
    setExamText(SAMPLE_FGV_RECEITA_TEXT);
    setAnswerKeyText(SAMPLE_FGV_RECEITA_KEY);
    setResult(null);
    setActiveTab('input');
  };

  const handleProcessExtraction = async () => {
    if (!examPdfFile && !examText.trim()) {
      alert('Por favor, faça upload do PDF da prova oficial ou insira o texto.');
      return;
    }

    setIsProcessing(true);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/admin/ingest-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          metadata,
          examPdfBase64: examPdfFile?.base64,
          answerKeyPdfBase64: answerKeyPdfFile?.base64,
          examText: examText || SAMPLE_CEBRASPE_PF_TEXT,
          answerKeyText: answerKeyText || SAMPLE_CEBRASPE_PF_KEY,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
        setActiveTab('audit_preview');
      } else {
        alert(`Erro na extração: ${data.error || 'Falha ao processar os PDFs'}`);
      }
    } catch (err: any) {
      alert(`Falha de conexão com a API: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommitToSupabase = async () => {
    if (!result || result.questions.length === 0) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/ingest-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commit',
          metadata: result.metadata,
          questions: result.questions,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(data.message || 'Questões gravadas com sucesso!');
        if (onQuestionsIngested) {
          onQuestionsIngested(result.questions);
        }
      } else {
        alert(`Erro ao salvar: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Falha de conexão: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySql = () => {
    if (!result?.sqlInsertScript) return;
    navigator.clipboard.writeText(result.sqlInsertScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `provas_${metadata.institution.toLowerCase().replace(/\s+/g, '_')}_${metadata.year}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Upload & Ingestão de PDFs de Provas Oficiais
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Upload Direto de PDF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Arraste os PDFs oficiais da prova e do gabarito definitivo. O Gemini 1.5 Flash extrai e audita tudo automaticamente.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar de navegação de abas */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'input'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              1. Upload dos PDFs (Prova + Gabarito)
            </button>
            <button
              onClick={() => result && setActiveTab('audit_preview')}
              disabled={!result}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'audit_preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : result
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>2. Auditoria & Conferência</span>
              {result && (
                <span className="px-1.5 py-0.2 bg-indigo-900/60 text-indigo-300 rounded text-[10px] font-bold">
                  {result.questions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => result && setActiveTab('sql_export')}
              disabled={!result}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'sql_export'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : result
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              3. Script SQL Supabase
            </button>
          </div>

          {/* Atalhos de Demonstração com 1 clique */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-slate-500">PDFs de Exemplo:</span>
            <button
              onClick={loadSampleCebraspe}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            >
              📄 PF 2021 (Cebraspe)
            </button>
            <button
              onClick={loadSampleFgv}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            >
              📄 Receita 2023 (FGV)
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-xs text-emerald-400 hover:underline"
              >
                Dispensar
              </button>
            </div>
          )}

          {/* ABA 1: ENTRADA DE DADOS E UPLOAD DE PDF */}
          {activeTab === 'input' && (
            <div className="space-y-6">
              {/* Metadados do Concurso */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Metadados do Concurso Oficial
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Banca Examinadora</label>
                    <select
                      value={metadata.banca}
                      onChange={(e) => setMetadata({ ...metadata, banca: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="Cebraspe">Cebraspe (Certo / Errado)</option>
                      <option value="FGV">FGV (Múltipla Escolha 5 Alt.)</option>
                      <option value="Vunesp">Vunesp</option>
                      <option value="FCC">FCC (Fundação Carlos Chagas)</option>
                      <option value="Outra">Outra Banca</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Órgão / Instituição</label>
                    <input
                      type="text"
                      value={metadata.institution}
                      onChange={(e) => setMetadata({ ...metadata, institution: e.target.value })}
                      placeholder="Ex: Polícia Federal"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Cargo</label>
                    <input
                      type="text"
                      value={metadata.role}
                      onChange={(e) => setMetadata({ ...metadata, role: e.target.value })}
                      placeholder="Ex: Agente"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Ano da Prova</label>
                    <input
                      type="number"
                      value={metadata.year}
                      onChange={(e) => setMetadata({ ...metadata, year: parseInt(e.target.value, 10) || 2024 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-slate-400 mb-1">Carreira</label>
                    <select
                      value={metadata.careerCategory}
                      onChange={(e) => setMetadata({ ...metadata, careerCategory: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="policial">Carreira Policial</option>
                      <option value="fiscal">Carreira Fiscal / Tributária</option>
                      <option value="tribunais">Tribunais & Ministério Público</option>
                      <option value="juridica">Carreiras Jurídicas (OAB/Magistratura)</option>
                      <option value="administrativa">Área Administrativa</option>
                      <option value="bancaria">Bancária</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Caderno / Cor de Prova</label>
                    <input
                      type="text"
                      value={metadata.bookletColorOrCode || ''}
                      onChange={(e) => setMetadata({ ...metadata, bookletColorOrCode: e.target.value })}
                      placeholder="Ex: Caderno Branco, Tipo 1"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Link Oficial da Banca (Auditoria)</label>
                    <input
                      type="text"
                      value={metadata.sourceUrl || ''}
                      onChange={(e) => setMetadata({ ...metadata, sourceUrl: e.target.value })}
                      placeholder="https://cebraspe.org.br/..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ZONAS DE UPLOAD DE PDF (DRAG & DROP) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DROPZONE 1: PDF DO CADERNO DE PROVA */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      1. Caderno da Prova Oficial (PDF)
                    </span>
                    <span className="text-[11px] text-indigo-400 font-medium">Arquivo .PDF</span>
                  </div>

                  {/* Input de arquivo invisível */}
                  <input
                    type="file"
                    ref={examFileInputRef}
                    accept=".pdf"
                    onChange={handleExamFileUpload}
                    className="hidden"
                  />

                  {examPdfFile ? (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/40 flex items-center justify-between group hover:border-indigo-400 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <FileType className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[220px]">
                            {examPdfFile.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-slate-400">{examPdfFile.size}</span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              ✓ PDF Pronto
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => examFileInputRef.current?.click()}
                          className="text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-colors"
                        >
                          Trocar
                        </button>
                        <button
                          type="button"
                          onClick={() => setExamPdfFile(null)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                          title="Remover arquivo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => examFileInputRef.current?.click()}
                      className="p-6 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-950/40 hover:bg-slate-950/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">
                          Clique ou arraste o PDF da Prova
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Caderno oficial baixado do Cebraspe, FGV, Vunesp, etc.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* DROPZONE 2: PDF DO GABARITO OFICIAL DEFINITIVO */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      2. Gabarito Oficial Definitivo (PDF)
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">Pós-Recursos</span>
                  </div>

                  {/* Input de arquivo invisível */}
                  <input
                    type="file"
                    ref={keyFileInputRef}
                    accept=".pdf,.txt"
                    onChange={handleKeyFileUpload}
                    className="hidden"
                  />

                  {answerKeyPdfFile ? (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex items-center justify-between group hover:border-emerald-400 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <FileType className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[220px]">
                            {answerKeyPdfFile.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-slate-400">{answerKeyPdfFile.size}</span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              ✓ Gabarito Pronto
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => keyFileInputRef.current?.click()}
                          className="text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-colors"
                        >
                          Trocar
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswerKeyPdfFile(null)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                          title="Remover arquivo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => keyFileInputRef.current?.click()}
                      className="p-6 rounded-xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-950/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">
                          Clique ou arraste o PDF do Gabarito
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Gabarito oficial homologado pós-recursos
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão Alternativo Opcional: Colar Texto Manual */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualTextToggle(!showManualTextToggle)}
                  className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{showManualTextToggle ? '▾ Ocultar caixas de texto manual' : '▸ Prefere colar o texto copiado do PDF?'}</span>
                </button>

                {showManualTextToggle && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 animate-fadeIn">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Texto da Prova</label>
                      <textarea
                        rows={6}
                        value={examText}
                        onChange={(e) => setExamText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:border-indigo-500 outline-none resize-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Gabarito Definitivo em Texto</label>
                      <textarea
                        rows={6}
                        value={answerKeyText}
                        onChange={(e) => setAnswerKeyText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:border-emerald-500 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Didático de Instrução */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
                <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>
                  <strong>Como funciona:</strong> Ao clicar no botão abaixo, o <strong>Gemini 1.5 Flash</strong> lê os PDFs carregados, identifica as questões com duas colunas e formatações complexas, cruza com o gabarito oficial e marca questões anuladas ou com leis revogadas.
                </span>
              </div>

              {/* Botão de Disparo */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleProcessExtraction}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Lendo PDFs com Gemini 1.5 Flash...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extrair & Auditar PDFs</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ABA 2: AUDITORIA & CONFERÊNCIA (HUMAN-IN-THE-LOOP) */}
          {activeTab === 'audit_preview' && result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Cards de Métricas de Confiabilidade */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total de Questões</span>
                  <span className="text-xl font-bold text-white">{result.summary.totalQuestionsExtracted}</span>
                </div>
                <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-400 block">Gabaritos Válidos</span>
                  <span className="text-xl font-bold text-emerald-300">{result.summary.validQuestionsCount}</span>
                </div>
                <div className="p-3.5 bg-amber-950/30 rounded-xl border border-amber-500/30">
                  <span className="text-[11px] text-amber-400 block">Anuladas Oficialmente</span>
                  <span className="text-xl font-bold text-amber-300">{result.summary.annulledQuestionsCount}</span>
                </div>
                <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-500/30">
                  <span className="text-[11px] text-cyan-400 block">Confiabilidade Média</span>
                  <span className="text-xl font-bold text-cyan-300">{result.summary.averageConfidence}%</span>
                </div>
              </div>

              {/* Avisos & Alertas de Auditoria */}
              {result.warnings.length > 0 && (
                <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Alertas de Anulação e Legislação ({result.warnings.length}):
                  </span>
                  <ul className="list-disc list-inside text-amber-200/80 pl-2 space-y-0.5">
                    {result.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lista de Questões Extraídas com Auditoria */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Conferência de Questões Extraídas ({result.questions.length} itens)</span>
                  <span>Revise o gabarito e o status antes de salvar</span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {result.questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                            Item {q.questionNumber}
                          </span>
                          <span className="text-slate-400">{q.subjectName}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{q.topicName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {q.isAnnulledByBanca ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              ⚠️ ANULADA PELA BANCA
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Gabarito: {q.officialAnswerKey}
                            </span>
                          )}

                          {q.legalStatus === 'alterada_pela_lei' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              ⚠️ Lei Alterada
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enunciado */}
                      <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                        {q.statement}
                      </p>

                      {/* Alternativas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-lg border flex items-center justify-between ${
                              opt.isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-semibold'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {opt.isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-2 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Fundamento & Detalhes de Auditoria */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Fonte: {q.auditSource}</span>
                        {q.codeCitation && <span className="font-mono text-indigo-400">{q.codeCitation}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de Ação Final */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/80 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>SQL Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar SQL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/80 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar JSON</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('input')}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Voltar aos PDFs
                  </button>

                  <button
                    onClick={handleCommitToSupabase}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Gravando no PostgreSQL...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Gravar no Supabase ({result.questions.length} itens)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: SCRIPT SQL EXPORT */}
          {activeTab === 'sql_export' && result && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Script pronto para colar no SQL Editor do Supabase Dashboard
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Script SQL Completo</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                rows={16}
                value={result.sqlInsertScript}
                className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed select-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
