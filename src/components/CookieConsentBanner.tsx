'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Cookie, 
  Settings2, 
  Check, 
  X, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'argus_cookie_consent';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Exibe após 1.2 segundos para não concorrer com o carregamento visual inicial
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  if (!isVisible) return null;

  const saveConsent = (preferences: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    });
  };

  const handleAcceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      necessary: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <aside 
      aria-label="Aviso de Privacidade e Consentimento de Cookies LGPD"
      className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-5 animate-slide-up pointer-events-none"
    >
      <div className="max-w-4xl mx-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-6 pointer-events-auto text-slate-900 dark:text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Mensagem e Ícone */}
          <div className="flex items-start gap-3.5 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                  Privacidade & LGPD
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Lei Geral de Proteção de Dados
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Valorizamos sua privacidade e segurança dos seus dados
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Utilizamos cookies essenciais para garantir o funcionamento seguro do Argus (sessão e tokenização). Com sua autorização, utilizamos também identificadores para calibrar a precisão psicométrica das questões. Saiba mais na nossa{' '}
                <Link 
                  href="/privacidade" 
                  className="font-bold text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700"
                >
                  Política de Privacidade e Cookies
                </Link>.
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Opções</span>
              {showPreferences ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            <button
              onClick={handleAcceptNecessary}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Apenas Necessários
            </button>

            <button
              onClick={handleAcceptAll}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              Aceitar Todos
            </button>
          </div>
        </div>

        {/* Painel Acordeão de Preferências */}
        {showPreferences && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            {/* 1. Essenciais */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black">Estritamente Necessários</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Obrigatório
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Sessão segura, autenticação criptográfica e prevenção de ataques CSRF e SQLi.
              </p>
            </div>

            {/* 2. Analíticos */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black">Métricas & Diagnóstico</span>
                <input 
                  type="checkbox" 
                  checked={analyticsAllowed} 
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Análise de tempo por questão e calibração da curva do esquecimento do SRS.
              </p>
            </div>

            {/* 3. Marketing */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black">Comunicação & Editais</span>
                <input 
                  type="checkbox" 
                  checked={marketingAllowed} 
                  onChange={(e) => setMarketingAllowed(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Alertas personalizados sobre novas vagas de concursos do seu interesse.
              </p>
            </div>

            <div className="sm:col-span-3 flex justify-end pt-1">
              <button
                onClick={handleSaveCustom}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black cursor-pointer hover:opacity-90"
              >
                Salvar Preferências Selecionadas
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
