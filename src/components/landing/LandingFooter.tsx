import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ShieldCheck, Lock } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-sm text-slate-500 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <span className="font-extrabold text-slate-900 dark:text-white">Learning AI</span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500">• O Copiloto Cognitivo para Concursos</span>
        </div>

        {/* Links Legais e Conformidade Obrigatória para Anúncios (Meta & Google) */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Link 
            href="/termos" 
            className="hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            Termos de Uso
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link 
            href="/privacidade" 
            className="hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            Política de Privacidade (LGPD)
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a 
            href="mailto:suporte@learningai.com.br" 
            className="hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            Suporte: suporte@learningai.com.br
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-white/5 text-xs text-slate-400">
        <p>© 2026 Learning AI Tecnologia Educacional. Todos os direitos reservados.</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <Lock className="w-3.5 h-3.5" />
            Pagamentos Criptografados via Asaas & Pix
          </span>
        </div>
      </div>
    </footer>
  );
};
