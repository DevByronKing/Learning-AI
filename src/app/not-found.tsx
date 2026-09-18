import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#080C14] text-white text-center">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-4xl mb-6 shadow-xl">
        🔍
      </div>
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-100 mb-2">
        Página não encontrada
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        O módulo ou página que você está procurando não existe ou foi reorganizado no Learning AI.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all shadow-lg shadow-blue-600/30"
      >
        Voltar para a Plataforma
      </Link>
    </div>
  );
}
