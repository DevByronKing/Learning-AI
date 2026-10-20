'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Autenticando com o Google...');

  useEffect(() => {
    let isMounted = true;

    const processOAuthCallback = async () => {
      const code = searchParams.get('code');
      const errorDescription = searchParams.get('error_description');

      if (errorDescription) {
        if (isMounted) {
          setStatus('error');
          setMessage(`Erro na autenticação: ${errorDescription}`);
          setTimeout(() => router.replace('/'), 3000);
        }
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        if (isMounted) {
          setStatus('error');
          setMessage('Cliente Supabase não configurado.');
          setTimeout(() => router.replace('/'), 2500);
        }
        return;
      }

      try {
        if (code) {
          // Troca o código OAuth pela sessão oficial (acessa o PKCE code_verifier no localStorage)
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Erro na troca do código OAuth por sessão:', error);
            if (isMounted) {
              setStatus('error');
              setMessage(error.message || 'Falha ao autenticar.');
              setTimeout(() => router.replace('/'), 3000);
            }
            return;
          }

          if (data.session && data.session.user) {
            const user = data.session.user;
            const fullName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'Aluno Concurseiro';

            // Sincroniza imediatamente o estado global do usuário
            useAuthStore.getState().setAuth(
              {
                id: user.id,
                email: user.email || '',
                name: fullName,
                role: 'student',
              },
              data.session.access_token
            );

            // Atualiza o perfil caso haja nome do Google
            if (fullName) {
              useAuthStore.getState().updateProfile({
                name: fullName,
                warName: fullName.split(' ')[0],
              });
            }

            if (isMounted) {
              setStatus('success');
              setMessage(`Bem-vindo, ${fullName}! Redirecionando...`);
              setTimeout(() => router.replace('/'), 1200);
            }
            return;
          }
        }

        // Caso já exista uma sessão ativa ou redirecionamento sem code
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const user = sessionData.session.user;
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Aluno Concurseiro';

          useAuthStore.getState().setAuth(
            {
              id: user.id,
              email: user.email || '',
              name: fullName,
              role: 'student',
            },
            sessionData.session.access_token
          );

          if (isMounted) {
            setStatus('success');
            setMessage(`Sessão ativa confirmada! Redirecionando...`);
            setTimeout(() => router.replace('/'), 1000);
          }
          return;
        }

        // Sem código nem sessão
        if (isMounted) {
          router.replace('/');
        }
      } catch (err: any) {
        console.error('Falha inesperada no callback OAuth:', err);
        if (isMounted) {
          setStatus('error');
          setMessage(err?.message || 'Falha inesperada ao autenticar.');
          setTimeout(() => router.replace('/'), 3000);
        }
      }
    };

    processOAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center">
      <div className="mb-6">
        <BrandLogo size={56} showGlow />
      </div>

      <h1 className="text-xl font-black text-white tracking-tight mb-2">
        Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI</span>
      </h1>

      <div className="my-6 flex items-center justify-center">
        {status === 'processing' && (
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <div className="absolute inset-0 rounded-full blur-md bg-blue-500/20" />
          </div>
        )}
        {status === 'success' && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        )}
        {status === 'error' && (
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-10 h-10" />
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-slate-300 mb-2">{message}</p>
      <p className="text-xs text-slate-500">
        {status === 'processing'
          ? 'Conectando ao Supabase e validando suas credenciais...'
          : 'Você será redirecionado para a plataforma automaticamente.'}
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#090D16] p-4">
      <Suspense
        fallback={
          <div className="text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-sm">Carregando autenticação...</span>
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
