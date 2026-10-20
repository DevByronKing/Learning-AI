'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  KeyRound, 
  Copy, 
  Check, 
  AlertTriangle, 
  X, 
  ArrowRight,
  RefreshCw,
  Eye,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { 
  generateBase32Secret, 
  generateBackupCodes, 
  verifyTwoFactorToken, 
  saveTwoFactorState, 
  getTwoFactorState, 
  markTwoFactorSessionVerified,
  TwoFactorState 
} from '@/lib/twoFactorAuth';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'setup' | 'challenge';
  userEmail?: string;
  onSuccess?: () => void;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
  mode = 'setup',
  userEmail = 'aluno@argus.app.br',
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<'qr' | 'verify' | 'backup' | 'challenge'>('qr');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setTokenInput('');
      const existingState = getTwoFactorState();

      if (mode === 'challenge') {
        setCurrentStep('challenge');
        setSecret(existingState.secret || 'ARGUSSECURITYKEY');
        setBackupCodes(existingState.backupCodes || []);
      } else {
        // Setup Mode
        const newSecret = existingState.secret || generateBase32Secret(16);
        const newCodes = existingState.backupCodes && existingState.backupCodes.length > 0 
          ? existingState.backupCodes 
          : generateBackupCodes(5);
        setSecret(newSecret);
        setBackupCodes(newCodes);
        setCurrentStep(existingState.enabled ? 'backup' : 'qr');
      }
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2500);
    }
  };

  const handleCopyCodes = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2500);
    }
  };

  const handleVerify = () => {
    setErrorMsg(null);
    if (!tokenInput.trim()) {
      setErrorMsg('Informe o código de 6 dígitos.');
      return;
    }

    const result = verifyTwoFactorToken(tokenInput, secret, backupCodes);

    if (result.valid) {
      if (result.isBackupCode && result.remainingBackupCodes) {
        setBackupCodes(result.remainingBackupCodes);
        const existing = getTwoFactorState();
        saveTwoFactorState({
          ...existing,
          backupCodes: result.remainingBackupCodes
        });
      }

      markTwoFactorSessionVerified();

      if (mode === 'setup') {
        saveTwoFactorState({
          enabled: true,
          secret,
          backupCodes,
          verifiedAt: new Date().toISOString(),
          enforcedForAdmin: true
        });
        setCurrentStep('backup');
      } else {
        if (onSuccess) onSuccess();
        onClose();
      }
    } else {
      setErrorMsg('Código 2FA incorreto ou expirado. Tente novamente ou use um código de backup.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Gradiente */}
        <div className="relative p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                Segurança Nível Bancário (2FA / MFA)
              </span>
              <h3 className="text-xl font-black tracking-tight mt-1">
                {mode === 'challenge' ? 'Validação de Dois Fatores' : 'Configurar 2FA (TOTP)'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-2 leading-relaxed">
            {mode === 'challenge' 
              ? 'Confirme o código gerado no seu aplicativo autenticador para acessar este recurso administrativo protegido.'
              : 'Blindagem contra vazamentos de credenciais. Exige código temporário para operações de alta sensibilidade.'
            }
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Passo 1 (Setup): Chave e instruções */}
          {currentStep === 'qr' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>1. Abra seu App Autenticador</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Use o <strong>Google Authenticator</strong>, <strong>Authy</strong>, <strong>1Password</strong> ou app equivalente no seu smartphone.
                </p>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Chave Secreta Manual (Base32):
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={secret} 
                      className="flex-1 font-mono text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                    >
                      {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSecret ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep('verify')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Avançar para Verificação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Passo 2 / Challenge: Inserção do Código */}
          {(currentStep === 'verify' || currentStep === 'challenge') && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Digite o código de 6 dígitos gerado no app:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={8}
                    autoFocus
                    placeholder="Ex: 842 195 ou código de backup"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify();
                    }}
                    className="w-full text-center tracking-widest text-xl font-mono font-black py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStep === 'verify' && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep('qr')}
                    className="px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleVerify}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Validar e Liberar Acesso</span>
                </button>
              </div>
            </div>
          )}

          {/* Passo 3: Códigos de Backup */}
          {currentStep === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Guarde seus Códigos de Recuperação</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Se você perder o acesso ao seu celular, cada um destes códigos pode ser usado uma única vez para entrar na sua conta:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs font-black">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center select-all">
                      {code}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="w-full py-2 rounded-xl bg-slate-900 text-white dark:bg-white/10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800 mt-2"
                >
                  {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodes ? 'Códigos Copiados!' : 'Copiar Todos os Códigos'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir e Proteger Conta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
