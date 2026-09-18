import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade & Proteção de Dados (LGPD) | Learning AI',
  description: 'Conheça como a Learning AI trata, protege e armazena os seus dados de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080C14] text-slate-800 dark:text-slate-200 transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#080C14]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o Início</span>
          </Link>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              Learning <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Política de Privacidade & Tratamento de Dados
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Conforme a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {/* 1 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>1. Compromisso com a Privacidade</span>
              </h2>
              <p>
                A <strong>Learning AI</strong> respeita a privacidade de seus usuários e adota medidas técnicas, administrativas e de segurança da informação adequadas para proteger todos os dados pessoais coletados contra acessos não autorizados, destruição, perda, alteração ou qualquer forma de tratamento ilícito.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>2. Dados Pessoais Coletados</span>
              </h2>
              <p className="mb-2">Coletamos exclusivamente os dados necessários para a prestação dos serviços educacionais:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Dados Cadastrais:</strong> Nome completo, endereço de e-mail e cargo/carreira pretendida.</li>
                <li><strong>Dados de Pagamento:</strong> Processados diretamente em ambiente seguro com tokenização criptográfica PCI-DSS pelos gateways autorizados (Asaas e Stripe). A Learning AI não armazena números de cartões de crédito em seus servidores.</li>
                <li><strong>Métricas de Aprendizado:</strong> Respostas assinaladas, tempo gasto por questão, taxa de acerto e cadernos de erros para geração de diagnósticos cognitivos personalizados.</li>
                <li><strong>Cookies e Rastreamento de Anúncios:</strong> Identificadores anônimos de navegação para aprimoramento contínuo da experiência do usuário e mensuração de campanhas (Google Analytics e Meta Pixel).</li>
              </ul>
            </section>

            {/* 3 */}
            <section className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-200 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>3. Finalidades do Tratamento de Dados</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
                Os dados dos usuários são utilizados unicamente para: (i) Autenticação de conta e restauração de sessões; (ii) Personalização do algoritmo de repetição espaçada e cálculo de vulnerabilidades por banca; (iii) Notificação sobre editais publicados do seu interesse; e (iv) Cumprimento de obrigações legais e fiscais.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>4. Não Compartilhamento e Sigilo Absoluto</span>
              </h2>
              <p>
                A Learning AI <strong>NÃO comercializa, não aluga e não compartilha</strong> os dados pessoais dos seus alunos com terceiros para fins publicitários externos. Os dados de performance cognitiva são estritamente confidenciais e acessíveis apenas pelo titular da respectiva conta.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>5. Direitos do Titular de Dados (Art. 18 da LGPD)</span>
              </h2>
              <p className="mb-2">Você possui o direito de, a qualquer momento e mediante requisição expressa:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Confirmar a existência de tratamento de dados;</li>
                <li>Acessar os seus dados pessoais armazenados;</li>
                <li>Solicitar a correção de dados incompletos ou desatualizados;</li>
                <li>Solicitar a exclusão definitiva da sua conta e de todos os registros cognitivos associados.</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>6. Encarregado de Proteção de Dados (DPO)</span>
              </h2>
              <p>
                Para exercer qualquer dos seus direitos previstos na LGPD ou esclarecer dúvidas sobre esta política, entre em contato diretamente com o nosso Encarregado de Dados pelo email: <strong className="text-indigo-600 dark:text-indigo-400">dpo@learningai.com.br</strong> ou <strong className="text-indigo-600 dark:text-indigo-400">privacidade@learningai.com.br</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
