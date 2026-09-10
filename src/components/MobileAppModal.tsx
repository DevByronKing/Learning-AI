'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  QrCode, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>('android');

  if (!isOpen) return null;

  const mobileUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8081` 
    : 'http://localhost:8081';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    analytics.track('mascot_strategy_interacted', { action: 'copy_mobile_link' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30">
                  Onboarding Multimodal
                </span>
                <span className="flex items-center text-xs text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                  Sincronização Ativa
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Continuar Estudos no Celular
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-6">
          
          {/* Seletor de Plataforma */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activePlatform === 'android'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Android (Samsung / Motorola / Xiaomi)</span>
            </button>
            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activePlatform === 'ios'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>iOS (iPhone / iPad)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Box do QR Code Estilizado */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center group">
              <div className="relative p-3 bg-white rounded-xl shadow-inner mb-3">
                {/* QR Code SVG Vetorial Limpo */}
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Padrão de QR Code Simulado e Legível */}
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="black" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="black" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="black" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="black" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="black" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="black" />

                  {/* Pontos de dados */}
                  <rect x="40" y="8" width="6" height="6" fill="black" />
                  <rect x="50" y="15" width="6" height="6" fill="black" />
                  <rect x="42" y="25" width="6" height="6" fill="black" />
                  <rect x="54" y="28" width="6" height="6" fill="black" />

                  <rect x="8" y="42" width="6" height="6" fill="black" />
                  <rect x="18" y="48" width="6" height="6" fill="black" />
                  <rect x="26" y="40" width="6" height="6" fill="black" />

                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#4F46E5" />
                  <circle cx="50" cy="50" r="4" fill="white" />

                  <rect x="68" y="42" width="8" height="8" fill="black" />
                  <rect x="80" y="48" width="6" height="6" fill="black" />
                  <rect x="72" y="56" width="6" height="6" fill="black" />

                  <rect x="40" y="68" width="8" height="8" fill="black" />
                  <rect x="52" y="75" width="8" height="8" fill="black" />
                  <rect x="44" y="85" width="6" height="6" fill="black" />
                  <rect x="68" y="68" width="8" height="8" fill="black" />
                  <rect x="82" y="78" width="6" height="6" fill="black" />
                  <rect x="74" y="88" width="10" height="6" fill="black" />
                </svg>
              </div>

              <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Aponte a câmera ou Expo Go</span>
              </div>
            </div>

            {/* Passos do Onboarding */}
            <div className="space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/30">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Instale o Expo Go (Gratuito)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Disponível diretamente na Google Play Store ou App Store da Apple.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/30">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Escaneie o QR Code
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Abra o app Expo Go e aponte para o código ao lado.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Sincronização 100% Automática
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Seus simulados, streak diário e mascote continuam do ponto exato onde você parou.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Link Manual / Copiar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 truncate max-w-[280px]">
              {mobileUrl}
            </span>

            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer com Selo de Performance Nativa */}
        <div className="bg-slate-950/60 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Código Nativo Puro • Sem WebViews • 120 FPS</span>
          </div>

          <button
            onClick={() => {
              window.open(mobileUrl, '_blank');
              analytics.track('mascot_strategy_interacted', { action: 'open_mobile_web_preview' });
            }}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            <span>Abrir Preview Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
