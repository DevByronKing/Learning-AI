import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-sm text-slate-500">
      <div className="flex items-center justify-center gap-3 mb-4">
        <BrainCircuit className="w-5 h-5 text-indigo-400" />
        <span className="font-bold text-slate-600 dark:text-slate-300">AprovaLens AI</span>
        <span className="hidden sm:inline">• Acelerador Cognitivo de Aprovação</span>
      </div>
      <p>© 2026 AprovaLens AI Inc. Todos os direitos reservados. Feito para concurseiros de alta performance.</p>
    </footer>
  );
};
