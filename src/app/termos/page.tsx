import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Termos e Condições de Uso | Learning AI',
  description: 'Termos de Serviço, condições de assinatura e regras de utilização da plataforma Learning AI.',
};

export default function TermosPage() {
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
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Termos e Condições de Uso
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Última atualização: 18 de setembro de 2026
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {/* 1 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>1. Objeto e Aceitação dos Termos</span>
              </h2>
              <p>
                Ao acessar, cadastrar-se ou utilizar a plataforma <strong>Learning AI</strong>, você concorda expressamente com os presentes Termos e Condições de Uso. A plataforma oferece ferramentas tecnológicas de inteligência artificial aplicada ao estudo cognitivo para concursos públicos, OAB e exames acadêmicos, incluindo verticalização de editais, simulados psicométricos, cadernos de erros inteligentes e repetição espaçada.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>2. Modalidades de Planos e Assinaturas</span>
              </h2>
              <p className="mb-2">
                A plataforma opera sob o modelo freemium com planos de assinatura paga:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Plano Aspirante (Gratuito):</strong> Acesso a diagnósticos básicos de questões, editais públicos e até 5 análises com IA diárias.</li>
                <li><strong>Plano Pro:</strong> Acesso prioritário ao motor cognitivo, simulados oficiais completos cronometrados, análises discursivas e cadernos de revanche ilimitados.</li>
                <li><strong>Plano Elite / Vitalício:</strong> Todas as funcionalidades do Plano Pro com suporte exclusivo, mentoria de IA contínua e garantia estendida de atualizações de editais.</li>
              </ul>
            </section>

            {/* 3 */}
            <section className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
              <h2 className="text-base font-bold text-indigo-950 dark:text-indigo-200 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>3. Direito de Arrependimento e Garantia Incondicional (7 Dias - CDC)</span>
              </h2>
              <p className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">
                Em estrita consonância com o <strong>Artigo 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>, o assinante poderá exercer seu direito de arrependimento no prazo improrrogável de até <strong>7 (sete) dias corridos</strong> a contar da confirmação do pagamento. O reembolso será integral, processado de imediato para a mesma conta ou cartão de origem, sem necessidade de justificativa.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>4. Processamento de Pagamentos e Renovações</span>
              </h2>
              <p>
                Os pagamentos na plataforma são processados com certificação bancária através do gateway autorizado <strong>Asaas Gestão Financeira</strong> (para cobranças via Pix e Boleto) e/ou <strong>Stripe</strong> (para Cartões de Crédito). As assinaturas mensais ou anuais renovam-se de forma automática até que o usuário solicite o cancelamento formal via painel de usuário ou suporte por email.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>5. Natureza das Respostas de Inteligência Artificial</span>
              </h2>
              <p>
                A tecnologia da Learning AI utiliza modelos avançados de linguagem natural (LLMs) ajustados com heurísticas psicométricas das bancas examinadoras (Cebraspe, FGV, FCC, Vunesp). Embora a precisão das explicações e gabaritos seja continuamente auditada, a plataforma não substitui a leitura oficial de publicações no Diário Oficial da União e editais oficiais dos órgãos promotores.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>6. Propriedade Intelectual</span>
              </h2>
              <p>
                Todo o código-fonte, algoritmos de cálculo de distratores, design system, logotipos, banco de dados proprietário e animais guardiões são de titularidade exclusiva da <strong>Learning AI</strong>. É terminantemente proibida a engenharia reversa, raspagem massiva automatizada (web scraping) não autorizada ou comercialização de contas de acesso.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>7. Canal de Atendimento e Suporte ao Aluno</span>
              </h2>
              <p>
                Para dúvidas jurídicas, cancelamentos, estornos ou suporte técnico, disponibilizamos atendimento através do email oficial: <strong className="text-indigo-600 dark:text-indigo-400">suporte@learningai.com.br</strong> com tempo de resposta em até 24 horas úteis.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
