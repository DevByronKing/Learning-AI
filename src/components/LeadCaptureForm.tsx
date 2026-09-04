'use client';

import React, { useState } from 'react';
import { 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  Sparkles, 
  ArrowRight, 
  Printer,
  Mail,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EditalCatalogItem } from '@/lib/editaisCatalog';

interface LeadCaptureFormProps {
  edital: EditalCatalogItem;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ edital }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Máscara dinâmica de telefone celular brasileiro (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          editalSlug: edital.slug,
          examTitle: edital.title,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar cadastro');
      }

      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gerador e baixador nativo de planilha CSV do Edital Verticalizado
  const handleDownloadCSV = () => {
    const headers = [
      'Disciplina',
      'Tópico / Conteúdo Programático',
      'Peso da Banca',
      'Prioridade Algorítmica',
      'Teoria Estudada (OK)',
      'Questões Resolvidas',
      'Taxa de Acerto (%)',
      'Revisão 24h',
      'Revisão 7 Dias',
      'Revisão 30 Dias'
    ];

    const rows: string[] = [];
    rows.push(headers.join(';'));

    edital.subjects.forEach((subj) => {
      subj.keyTopics.forEach((topic) => {
        const row = [
          `"${subj.name.replace(/"/g, '""')}"`,
          `"${topic.replace(/"/g, '""')}"`,
          subj.weight.toString(),
          subj.priority.toUpperCase(),
          '[ ]',
          '0',
          '0%',
          '[ ]',
          '[ ]',
          '[ ]'
        ];
        rows.push(row.join(';'));
      });
    });

    // Adiciona BOM UTF-8 (\uFEFF) para abrir com acentuação correta no Excel brasileiro
    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Edital_Verticalizado_${edital.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Impressão / PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#141b30] to-[#0d1322] border border-indigo-500/30 shadow-2xl relative overflow-hidden glow-brand">
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {isSubmitted ? (
        <div className="text-center space-y-4 py-3 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/15">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Material Liberado com Sucesso!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Olá, <strong className="text-emerald-400">{name.split(' ')[0]}</strong>! Seu edital esquematizado para <strong className="text-slate-900 dark:text-white">{edital.institution}</strong> está pronto.
            </p>
          </div>

          {/* Action Buttons Post-Capture */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadCSV}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wide uppercase shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Baixar Planilha Excel / CSV (.csv)</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-3 px-4 rounded-xl bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Salvar em PDF ou Imprimir</span>
            </button>

            <div className="pt-2">
              <a
                href={`/?edital=${edital.slug}&tab=edital`}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Iniciar Estudos com IA na Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Você também pode acessar o simulador de questões da banca <strong>{edital.banca}</strong> sem custo.
          </p>
        </div>
      ) : (
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-extrabold border border-emerald-500/30 mb-3">
            <Download className="w-3.5 h-3.5" />
            <span>Download 100% Gratuito</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1.5 leading-snug">
            Baixe o Edital Verticalizado
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
            Receba a planilha oficial com todos os tópicos, incidência estatística da banca <strong>{edital.banca}</strong> e colunas de controle de revisões espaçadas.
          </p>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Seu Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Barbosa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Seu Melhor E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                WhatsApp (com DDD)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Liberando Download...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Liberar Download Gratuito</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sem spam. Seus dados estão 100% seguros com criptografia.</span>
          </div>
        </div>
      )}
    </div>
  );
};
