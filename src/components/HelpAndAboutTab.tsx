'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Send, 
  Instagram, 
  Youtube, 
  ShieldAlert, 
  Lock, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Gift, 
  CheckCircle2, 
  Users, 
  HeartHandshake,
  AlertTriangle
} from 'lucide-react';

interface HelpAndAboutTabProps {
  showToast: (msg: string) => void;
}

export const HelpAndAboutTab: React.FC<HelpAndAboutTabProps> = ({
  showToast
}) => {
  const [activeSection, setActiveSection] = useState<'help' | 'about' | 'security' | 'piracy' | 'social'>('help');

  // Form State da Denúncia de Pirataria
  const [piracyUrl, setPiracyUrl] = useState('');
  const [piracyDetails, setPiracyDetails] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmittingPiracy, setIsSubmittingPiracy] = useState(false);
  const [piracySubmitted, setPiracySubmitted] = useState(false);

  // Form de Dúvida / Suporte
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  const handleSubmitPiracy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!piracyUrl.trim()) {
      showToast('Por favor, informe o link do grupo ou perfil de rateio.');
      return;
    }
    setIsSubmittingPiracy(true);
    setTimeout(() => {
      setIsSubmittingPiracy(false);
      setPiracySubmitted(true);
      showToast('🛡️ Denúncia anônima recebida pelo nosso departamento jurídico!');
      setPiracyUrl('');
      setPiracyDetails('');
    }, 1200);
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail.trim() || !supportMessage.trim()) {
      showToast('Preencha seu e-mail e mensagem.');
      return;
    }
    setIsSendingSupport(true);
    setTimeout(() => {
      setIsSendingSupport(false);
      showToast('Mensagem enviada! Responderemos em menos de 15 minutos.');
      setSupportMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Header com Navegação Rápida */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Central do Aluno & Institucional</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Precisa de Ajuda? Conheça a Learning AI
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Suporte humanizado, segurança dos seus dados, nossa história, redes sociais e canal oficial de combate à pirataria.
          </p>
        </div>

        {/* Abas Internas */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
          {[
            { id: 'help', label: 'Precisa de Ajuda / Suporte', icon: MessageSquare },
            { id: 'about', label: 'Quem Somos & Manifesto', icon: Users },
            { id: 'security', label: 'Segurança & LGPD', icon: ShieldCheck },
            { id: 'piracy', label: '🚨 Denuncie Pirataria (Ganhe 1 Ano Elite)', icon: ShieldAlert },
            { id: 'social', label: 'Redes Sociais & Comunidade', icon: Instagram }
          ].map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 1: PRECISA DE AJUDA & SUPORTE */}
      {activeSection === 'help' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Envie uma Mensagem para o Suporte
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dúvidas sobre o funcionamento da IA, editais ou seu plano? Nossa equipe pedagógica responde rapidamente.
              </p>

              <form onSubmit={handleSendSupport} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder="Ex: Amanda Silva"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Seu E-mail de Cadastro
                    </label>
                    <input
                      type="email"
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="exemplo@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Como podemos te ajudar hoje?
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Descreva sua dúvida, sugestão ou questão técnica..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingSupport}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingSupport ? 'Enviando...' : 'Enviar Mensagem'}</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            
            {/* Card WhatsApp Oficial */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Suporte Direto via WhatsApp</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Atendimento Oficial Segunda a Sábado</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Prefere falar no WhatsApp? Converse com nossos especialistas e tire dúvidas sobre simulados e assinaturas.
              </p>

              <a
                href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20Learning%20AI"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                <span>Chamar no WhatsApp Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Horários e E-mail */}
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-3 text-xs">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>suporte@learningai.com.br</span>
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Horário de Atendimento: Segunda a Sábado das 08h às 22h (Horário de Brasília).
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SEÇÃO 2: QUEM SOMOS & MANIFESTO */}
      {activeSection === 'about' && (
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Nossa Origem & Propósito
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Democratizando a Inteligência de Bancas para Concurseiros de Todo o Brasil
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              O <strong>Learning AI</strong> nasceu da frustração de quem viveu na pele o sofrimento do concurseiro: passar horas assistindo a videoaulas intermináveis, acumulando pilhas de PDFs de 200 páginas e, no domingo de prova, cair nas mesmas pegadinhas semânticas das bancas examinadoras.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Nossa equipe reúne auditores fiscais da Receita Federal, ex-examinadores de bancas, engenheiros de inteligência artificial e neurocientistas cognitivos. Unimos a metodologia comprovada do <strong>Ciclo de Estudos Meirelles</strong> com a potência de modelos neurais avançados (Google Gemini) para criar o primeiro copiloto educacional verdadeiramente adaptativo do país.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">🎯 Precisão Pedagógica</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Não usamos IA para inventar respostas; usamos a IA para auditar gabaritos oficiais e desmascarar os distratores semânticos.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">🧠 Respeito ao Tempo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sabemos que você estuda enquanto trabalha e cuida da família. Nosso foco é produtividade líquida máxima por hora gasta.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">🛡️ Ética & Transparência</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Garantia incondicional de reembolso pelo CDC em até 7 dias e respeito irrestrito à sua privacidade sob a LGPD.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 3: SEGURANÇA & LGPD */}
      {activeSection === 'security' && (
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Segurança da Informação & Proteção de Dados (LGPD)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Saiba como blindamos suas informações, métricas de estudo e pagamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Criptografia Ponta a Ponta</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Todas as conexões são intermediadas com certificados SSL/TLS de 256 bits. Seus dados de diagnóstico e respostas são armazenados em nuvem com isolamento por usuário (Row Level Security no Supabase).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pagamentos Transparentes & Seguros</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Não armazenamos números completos de cartões de crédito. O processamento das transações Pix e Cartão é realizado pela Asaas Gestão Financeira, instituição autorizada pelo Banco Central do Brasil.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-bold text-blue-600 dark:text-blue-400">
            <a href="/termos" className="hover:underline flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Ver Termos e Condições de Uso</span>
            </a>
            <span>•</span>
            <a href="/privacidade" className="hover:underline flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Ver Política de Privacidade (LGPD)</span>
            </a>
          </div>
        </div>
      )}

      {/* SEÇÃO 4: DENUNCIE PIRATARIA & RATEIOS */}
      {activeSection === 'piracy' && (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-rose-50 via-amber-50/30 to-white dark:from-rose-950/60 dark:via-slate-900 dark:to-amber-950/40 border border-rose-200 dark:border-rose-500/30 rounded-3xl p-6 sm:p-10 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Canal Oficial de Ética & Integridade</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              🚨 Denuncie Rateios Ilegais & Ganhe 1 Ano de Plano ELITE VIP
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Grupos clandestinos de rateio e revenda ilícita roubam a propriedade intelectual de educadores e expõem alunos a malwares, golpes financeiros e bloqueio definitivo de cadastro. 
              Ajude a manter a nossa comunidade justa e legal.
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 dark:text-amber-200">Recompensa Oficial do Learning AI:</strong> Toda denúncia com link ativo e comprovação que resulte na derrubada de grupos de rateio garante ao denunciante <strong>1 ANO COMPLETO DE ACESSO AO PLANO ELITE VIP</strong> de forma sigilosa e imediata!
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Formulário Sigiloso de Denúncia
            </h3>

            {piracySubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-black text-base text-emerald-700 dark:text-emerald-300">Denúncia Registrada com Sucesso!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Nosso corpo jurídico analisará o link. Entraremos em contato no e-mail informado para liberar sua recompensa assim que o caso for validado.
                </p>
                <button
                  onClick={() => setPiracySubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                >
                  Fazer outra denúncia
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPiracy} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Link do Grupo, Site ou Perfil Infrator (WhatsApp, Telegram, Mercado Livre, etc.) *
                  </label>
                  <input
                    type="text"
                    required
                    value={piracyUrl}
                    onChange={(e) => setPiracyUrl(e.target.value)}
                    placeholder="https://t.me/rateio_exemplo ou link do perfil"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Detalhes Adicionais (Chave Pix dos infratores, nomes de administradores ou prints)
                  </label>
                  <textarea
                    rows={3}
                    value={piracyDetails}
                    onChange={(e) => setPiracyDetails(e.target.value)}
                    placeholder="Conte como encontrou o grupo ou cole informações do vendedor não autorizado..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Seu E-mail ou WhatsApp para Receber a Recompensa (Opcional & 100% Sigiloso)
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="seuemail@exemplo.com ou (11) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPiracy}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isSubmittingPiracy ? 'Enviando Denúncia...' : 'Enviar Denúncia Sigilosa'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SEÇÃO 5: REDES SOCIAIS & COMUNIDADE */}
      {activeSection === 'social' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Faça Parte da Comunidade Learning AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Acompanhe novidades de editais, resoluções comentadas e eventos ao vivo com nossos professores e especialistas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/20 hover:border-pink-500/50 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">Instagram Oficial</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dicas rápidas de pegadinhas de bancas, enquetes diárias e motivação para os estudos.
                </p>
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 inline-flex items-center gap-1">
                  <span>@learningai.oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent border border-red-500/20 hover:border-red-500/50 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Youtube className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">Canal no YouTube</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aulas ao vivo de desconstrução de editais e engenharia reversa das bancas Cebraspe e FGV.
                </p>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 inline-flex items-center gap-1">
                  <span>Inscrever-se no Canal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>

              {/* Telegram VIP */}
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 hover:border-cyan-500/50 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">Comunidade Telegram</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Alertas em tempo real assim que um novo edital é publicado no Diário Oficial.
                </p>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 inline-flex items-center gap-1">
                  <span>Entrar no Grupo Grátis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
