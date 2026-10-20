'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2, AlertTriangle, FileText, Send, ArrowRight } from 'lucide-react';

export interface CopyrightTakedownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopyrightTakedownModal: React.FC<CopyrightTakedownModalProps> = ({ isOpen, onClose }) => {
  const [claimantName, setClaimantName] = useState('');
  const [claimantDocument, setClaimantDocument] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [relationship, setRelationship] = useState<'author' | 'rights_holder' | 'legal_representative'>('author');
  const [workTitle, setWorkTitle] = useState('');
  const [workRegistrationProof, setWorkRegistrationProof] = useState('');
  const [infringingUrlOrItem, setInfringingUrlOrItem] = useState('');
  const [infringementDescription, setInfringementDescription] = useState('');
  const [goodFaithDeclaration, setGoodFaithDeclaration] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [protocolResult, setProtocolResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodFaithDeclaration) {
      setErrorMessage('É obrigatório assinalar a declaração legal de boa-fé e titularidade.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/compliance/takedown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimantName,
          claimantDocument,
          claimantEmail,
          relationship,
          workTitle,
          workRegistrationProof,
          infringingUrlOrItem,
          infringementDescription,
          goodFaithDeclaration,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProtocolResult(data.protocol);
      } else {
        setErrorMessage(data.error || 'Falha ao registrar notificação.');
      }
    } catch {
      setErrorMessage('Erro de comunicação com o servidor de compliance.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProtocolResult(null);
    setErrorMessage(null);
    setClaimantName('');
    setClaimantDocument('');
    setClaimantEmail('');
    setWorkTitle('');
    setWorkRegistrationProof('');
    setInfringingUrlOrItem('');
    setInfringementDescription('');
    setGoodFaithDeclaration(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-left transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {protocolResult ? (
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Protocolo Gerado com Sucesso
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Notificação Autuada: <span className="font-mono text-blue-600 dark:text-blue-400">{protocolResult}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Nossa equipe jurídica iniciou a averiguação técnica. Conforme o Art. 19 do Marco Civil da Internet e a Lei 9.610/98, o conteúdo apontado passará por análise cautelar de indisponibilização em até <strong>48 horas úteis</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Etapas do Fluxo de Remoção:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <li>Verificação preliminar de titularidade e prova anexada;</li>
                <li>Suspensão cautelar do material objeto da notificação;</li>
                <li>Abertura de prazo de 5 dias para contranotificação do criador do conteúdo;</li>
                <li>Decisão final com confirmação de exclusão definitiva ou restauração legal.</li>
              </ul>
            </div>

            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs transition-colors"
            >
              Concluir e Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Canal Oficial de Notice & Takedown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Notificação de Violação de Direitos Autorais
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Utilize este canal para formalizar denúncias de reprodução indevida de conteúdo protegido pela Lei nº 9.610/98 e pelo Marco Civil da Internet (Lei nº 12.965/2014, Art. 19).
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Identificação do Notificante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nome Completo / Razão Social:
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="Nome do titular ou procurador"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  CPF ou CNPJ:
                </label>
                <input
                  type="text"
                  required
                  value={claimantDocument}
                  onChange={(e) => setClaimantDocument(e.target.value)}
                  placeholder="000.000.000-00 ou CNPJ"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  E-mail Oficial para Contato:
                </label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="email@titular.com.br"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Relação com a Obra:
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="author">Autor Original da Obra</option>
                  <option value="rights_holder">Titular / Editora / Cedente</option>
                  <option value="legal_representative">Representante Legal / Procurador</option>
                </select>
              </div>
            </div>

            {/* Dados da Obra Original & Localização do Conteúdo */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Título da Obra Protegida & Prova de Autoria:
                </label>
                <input
                  type="text"
                  required
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  placeholder="Ex: Livro Direito Constitucional Descomplicado / ISBN ou registro BN"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL ou Identificação Específica no Argus:
                </label>
                <input
                  type="text"
                  required
                  value={infringingUrlOrItem}
                  onChange={(e) => setInfringingUrlOrItem(e.target.value)}
                  placeholder="Ex: https://argus.app.br/questoes/... ou Código da Questão/Resumo"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Descrição dos Fatos e Fundamentação da Infração:
                </label>
                <textarea
                  required
                  rows={3}
                  value={infringementDescription}
                  onChange={(e) => setInfringementDescription(e.target.value)}
                  placeholder="Indique os trechos reproduzidos sem autorização e a violação aos direitos autorais."
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Declaração de Boa-fé e Veracidade */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={goodFaithDeclaration}
                  onChange={(e) => setGoodFaithDeclaration(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Declaro sob as penas da lei (Código Penal, Art. 299) e para os efeitos do Marco Civil da Internet que sou o titular ou representante legalmente habilitado dos direitos sobre a obra informada, e que as informações prestadas são exatas e verídicas.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Autuando Notificação...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Notificação Formal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
