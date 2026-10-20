'use client';

import React, { useState } from 'react';
import { SupabaseService } from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

interface GoogleSignInButtonProps {
  /**
   * Texto exibido no botão. Padrão: "Fazer login com Google"
   */
  text?: string;
  /**
   * Redirecionamento customizado após login com sucesso
   */
  redirectTo?: string;
  /**
   * Estilo visual do botão
   */
  variant?: 'standard' | 'outline' | 'dark';
  /**
   * Tamanho do botão
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Se true, ocupa 100% da largura do contêiner
   */
  fullWidth?: boolean;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Callback disparado antes de redirecionar para o Google
   */
  onSuccess?: () => void;
  /**
   * Callback em caso de erro ao iniciar o fluxo
   */
  onError?: (error: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  text = 'Fazer login com Google',
  redirectTo,
  variant = 'standard',
  size = 'md',
  fullWidth = false,
  className = '',
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    // Validação preventiva de credenciais do Supabase
    if (!isSupabaseConfigured()) {
      const err = 'Supabase não configurado no .env. Configure NEXT_PUBLIC_SUPABASE_URL e a chave Anon.';
      setErrorMsg(err);
      setIsLoading(false);
      onError?.(err);
      return;
    }

    try {
      const result = await SupabaseService.signInWithGoogle(redirectTo);

      if (!result.success) {
        throw new Error(result.error || 'Falha ao iniciar autenticação com Google.');
      }

      onSuccess?.();

      // Se a URL de autorização foi retornada e não houve redirecionamento automático
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Erro ao fazer login com Google:', err);
      const message = err?.message || 'Não foi possível conectar com o Google.';
      setErrorMsg(message);
      setIsLoading(false);
      onError?.(message);
    }
  };

  // Variantes de tamanho
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-2',
    md: 'px-4 py-2.5 text-sm gap-3',
    lg: 'px-6 py-3.5 text-base gap-3.5',
  }[size];

  // Variantes de cor e acabamento
  const variantClasses = {
    standard:
      'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 shadow-sm hover:shadow',
    outline:
      'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-300 dark:border-slate-700',
    dark:
      'bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 dark:bg-black dark:border-slate-800 dark:hover:bg-slate-950 shadow-sm',
  }[variant];

  return (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : 'inline-block'}`}>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        aria-label="Fazer login com sua conta Google"
        className={`relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
        ) : (
          <GoogleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        )}

        <span className="truncate">
          {isLoading ? 'Conectando ao Google...' : text}
        </span>
      </button>

      {errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Ícone oficial de 4 cores do Google ("G" Logo) em SVG vetorial de alta definição
 */
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      className={`${className} shrink-0`}
      width="16"
      height="16"
      style={{ display: 'inline-block', verticalAlign: 'middle', width: '1em', height: '1em', maxWidth: '24px', maxHeight: '24px' }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
};
