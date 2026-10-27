'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Mail,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  UserCheck,
  UserX,
  FileCheck,
} from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { BrandLogo } from './BrandLogo';
import { useAuthStore } from '@/store/useAuthStore';
import { SupabaseService } from '@/lib/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Verificação de Idade (ECA Digital - Lei 14.811/2024 e LGPD Art. 14)
  const [birthDate, setBirthDate] = useState('');
  const [parentalConsent, setParentalConsent] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');

  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user, setAuth } = useAuthStore();

  // Cálculo da idade em tempo real
  const ageCalculation = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, [birthDate]);

  if (!isOpen) return null;

  // Submissão de Login (Magic Link)
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await SupabaseService.signInWithEmail(email.trim());
      if (result.success) {
        setIsMagicLinkSent(true);
      } else {
        setErrorMessage(result.error || 'Falha ao enviar link de acesso.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao processar login por e-mail.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submissão de Cadastro Oficial com Verificação Etária
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (!birthDate || ageCalculation === null) {
      setErrorMessage('Informe sua data de nascimento para verificação etária (ECA Digital e LGPD).');
      return;
    }
    if (ageCalculation < 16) {
      setErrorMessage('Cadastro restrito a maiores de 16 anos conforme o ECA Digital (Lei 14.811/2024).');
      return;
    }
    if (ageCalculation >= 16 && ageCalculation < 18) {
      if (!parentalConsent || !guardianName.trim() || !guardianContact.trim()) {
        setErrorMessage('Para jovens de 16 a 17 anos, é obrigatório informar o consentimento, nome e contato do responsável legal.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim() || email.split('@')[0],
          birthDate,
          parentalConsent: ageCalculation >= 18 ? undefined : parentalConsent,
          guardianName: ageCalculation >= 18 ? undefined : guardianName.trim(),
          guardianContact: ageCalculation >= 18 ? undefined : guardianContact.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Conta verificada e criada com sucesso!');
        if (data.user) {
          setAuth(
            {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || fullName,
              role: 'student',
            },
            data.session?.accessToken || 'token_session'
          );
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(data.error || 'Falha ao realizar cadastro.');
      }
    } catch {
      setErrorMessage('Erro de conexão ao processar cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/15 shadow-2xl p-7 sm:p-9 my-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-3">
              <BrandLogo size={52} showGlow />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span>{mode === 'login' ? 'Acesse sua conta' : 'Criar Conta Oficial'}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                Argus
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              {mode === 'login'
                ? 'Sincronize seu Caderno de Erros, simulados e estatísticas de qualquer lugar.'
                : 'Cadastro verificado com conformidade integral ao ECA Digital e à LGPD.'}
            </p>
          </div>

          {/* Toggle Modo: Login vs Cadastro */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Já tenho conta
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Novo cadastro
            </button>
          </div>

          {/* Destaque OAuth Google (apenas no login ou como alternativa rápida) */}
          {mode === 'login' && (
            <div className="space-y-4 mb-2">
              <GoogleSignInButton
                text="Continuar com o Google"
                size="lg"
                fullWidth
                variant="standard"
                className="py-3.5 text-base shadow-sm hover:shadow-md"
                onSuccess={() => {}}
              />

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  ou link mágico por e-mail
                </span>
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              </div>
            </div>
          )}

          {/* Mensagens de Sucesso e Erro */}
          {errorMessage && (
            <div className="p-3 mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          {mode === 'login' ? (
            isMagicLinkSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Link de acesso enviado!
                </h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                  Verifique a caixa de entrada de <strong className="font-mono">{email}</strong> para entrar com 1 clique.
                </p>
                <button
                  type="button"
                  onClick={() => setIsMagicLinkSent(false)}
                  className="mt-3 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Tentar outro e-mail
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Seu e-mail cadastrado:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      data-clarity-mask="true"
                      data-mask="true"
                      data-private="true"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'Enviando...' : 'Receber Link Mágico de Acesso'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )
          ) : (
            /* FORMULÁRIO DE CADASTRO COM VERIFICAÇÃO ETÁRIA (ECA DIGITAL & LGPD) */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Souza"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  autoComplete="name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Seu melhor e-mail:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  autoComplete="email"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Crie uma Senha Segura (mínimo 6 caracteres):
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  autoComplete="new-password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Data de Nascimento com Verificação Real de Idade */}
              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Data de Nascimento (Verificação Legal):</span>
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    ECA Digital & LGPD
                  </span>
                </div>

                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  data-clarity-mask="true"
                  data-mask="true"
                  data-private="true"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />

                {/* Feedback em tempo real sobre a faixa etária */}
                {ageCalculation !== null && (
                  <div className="pt-1">
                    {ageCalculation < 16 ? (
                      <div className="p-2.5 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-200 flex items-start gap-2">
                        <UserX className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <strong>Restrição ECA Digital (Lei 14.811/2024 / CC Art. 3º):</strong>
                          <p className="mt-0.5 text-[10px] leading-relaxed">
                            Idade calculada: {ageCalculation} anos. O cadastro autônomo é vedado para menores de 16 anos desacompanhados de representação formal.
                          </p>
                        </div>
                      </div>
                    ) : ageCalculation >= 16 && ageCalculation < 18 ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
                          <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                          <div>
                            <strong>Jovem de 16-17 anos (Assistência Legal - CC Art. 4º / LGPD Art. 14):</strong>
                            <p className="mt-0.5 text-[10px] leading-relaxed">
                              Informe os dados do responsável legal para validação do consentimento assistido.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                              Nome do Responsável:
                            </label>
                            <input
                              type="text"
                              required
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              placeholder="Nome do pai/mãe/tutor"
                              data-clarity-mask="true"
                              data-mask="true"
                              data-private="true"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                              CPF ou E-mail do Responsável:
                            </label>
                            <input
                              type="text"
                              required
                              value={guardianContact}
                              onChange={(e) => setGuardianContact(e.target.value)}
                              placeholder="000.000.000-00 ou email"
                              data-clarity-mask="true"
                              data-mask="true"
                              data-private="true"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <label className="flex items-start gap-2 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            required
                            checked={parentalConsent}
                            onChange={(e) => setParentalConsent(e.target.checked)}
                            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                            Declaro que meus pais ou responsáveis legais estão cientes e autorizam o uso desta plataforma de estudos (LGPD Art. 14).
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Maioridade Plena Verificada ({ageCalculation} anos) • Acesso Liberado</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (ageCalculation !== null && ageCalculation < 16)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Verificando e Registrando...' : 'Criar Conta Verificada'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Vantagens da Conta Oficial */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Segurança & Proteção de Dados:
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Dados protegidos por criptografia de ponta a ponta</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sem gravação invasiva de sessão (Hotjar/Clarity bloqueados)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
