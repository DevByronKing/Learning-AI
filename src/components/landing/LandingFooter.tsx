'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ShieldAlert } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { CopyrightTakedownModal } from '../compliance/CopyrightTakedownModal';

export const LandingFooter: React.FC = () => {
  const [isTakedownOpen, setIsTakedownOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-sm text-slate-500 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={24} />
            <span className="font-extrabold text-slate-900 dark:text-white">Argus</span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500">• O Copiloto Cognitivo para Concursos</span>
          </div>

          {/* Links Legais e Conformidade Obrigatória (LGPD, CDC, Marco Civil) */}
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
            <button
              type="button"
              onClick={() => setIsTakedownOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Canal de Direitos Autorais (Notice & Takedown)</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a 
              href="mailto:contato@argus.app.br" 
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Suporte: contato@argus.app.br
            </a>
          </div>
        </div>

        {/* Identificação Empresarial Obrigatória (Decreto Federal nº 7.962/2013 - E-commerce e CDC) */}
        <div className="pt-4 pb-4 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            ARGUS TECNOLOGIA EDUCACIONAL LTDA. &bull; CNPJ nº 52.040.000/0001-98
          </p>
          <p>
            Av. Paulista, 1374, Bela Vista, São Paulo - SP, CEP 01310-100 &bull; DPO / Encarregado LGPD: dpo@argus.app.br
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-400">
          <p>© 2026 Argus Tecnologia Educacional. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              Pagamentos Criptografados via Asaas & Pix
            </span>
          </div>
        </div>
      </footer>

      {/* Modal de Notice & Takedown */}
      <CopyrightTakedownModal
        isOpen={isTakedownOpen}
        onClose={() => setIsTakedownOpen(false)}
      />
    </>
  );
};
