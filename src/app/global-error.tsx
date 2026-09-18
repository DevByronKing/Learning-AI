'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2">Erro Inesperado no Sistema</h1>
          <p className="text-sm text-slate-400 mb-6">
            Ocorreu uma falha crítica na inicialização da aplicação.
          </p>
          {error.message && (
            <p className="text-xs bg-slate-950 text-rose-300 font-mono p-3 rounded-xl mb-6 text-left overflow-auto max-h-24">
              {error.message}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}
