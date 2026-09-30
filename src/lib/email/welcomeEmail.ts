/**
 * Learning AI - Playbook de Conversão & Retenção
 * Template e Gatilho de E-mail de Boas-Vindas (Loop de Feedback Direto)
 * 
 * Filosofia: Estilo Superhuman / YC - Focado em iniciar uma conversa 1-a-1 com o fundador,
 * maximizando a taxa de resposta (reply-rate), entregabilidade (zero spam) e descoberta de PMF.
 */

export interface WelcomeEmailParams {
  name: string;
  email: string;
  targetExam?: string;
  guardianAnimal?: string;
  preferredStudyHours?: number;
}

export interface WelcomeEmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

/**
 * Gera a versão em Texto Puro (Essencial para inbox deliverability e visual pessoal)
 */
export function generateWelcomeEmailText(params: WelcomeEmailParams): string {
  const firstName = params.name ? params.name.split(' ')[0] : 'Futuro(a) Aprovado(a)';
  const exam = params.targetExam || 'seu concurso dos sonhos';

  return `Oi, ${firstName}!

Acabei de ver que você acabou de entrar no AprovaLens focado em ${exam}.

Sou o fundador do Learning-AI / AprovaLens, e meu único objetivo aqui é garantir que você rompa o teto dos 80-85% de acertos sem perder tempo estudando matérias irrelevantes ou caindo nas pegadinhas da banca examinadora.

Para que eu e nossa equipe de IA possamos calibrar o seu Plano de Engenharia Reversa perfeitamente, me responda diretamente a este e-mail com uma única frase:

👉 Qual é a matéria ou tópico que mais te tira o sono hoje, e quando você pretende fazer essa prova?

Eu leio e respondo pessoalmente cada uma das respostas para ajustar seus pontos cegos no sistema.

Um abraço e rumo à nomeação,

Lucas Barbosa
Fundador & Arquiteto Chefe — Learning-AI / AprovaLens
https://aprovalens.com.br`;
}

/**
 * Gera a versão em HTML Minimalista Responsivo (Estilo carta executiva elegante)
 */
export function generateWelcomeEmailHtml(params: WelcomeEmailParams): string {
  const firstName = params.name ? params.name.split(' ')[0] : 'Futuro(a) Aprovado(a)';
  const exam = params.targetExam || 'seu concurso dos sonhos';
  const guardian = params.guardianAnimal ? `(${params.guardianAnimal})` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao AprovaLens</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.65;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 36px 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .badge {
      display: inline-block;
      background: #eff6ff;
      color: #2563eb;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 20px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 18px;
    }
    p {
      margin: 14px 0;
      font-size: 15px;
      color: #334155;
    }
    .highlight-box {
      background: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .highlight-box p {
      margin: 0;
      font-weight: 600;
      color: #1e293b;
      font-size: 15px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;
    }
    .author-title {
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .author-role {
      font-size: 13px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Passaporte Cognitivo Ativado ${guardian}</span>
    <h1>Oi, ${firstName}! 👋</h1>
    
    <p>Acabei de ver que você concluiu seu diagnóstico inicial focado em <strong>${exam}</strong>.</p>
    
    <p>Sou o fundador do <strong>AprovaLens</strong>, e criei este projeto com uma única obsessão: fazer concurseiros sérios romperem a barreira dos 80-85% de acertos sem perder semanas decorando teorias inúteis ou caindo nas pegadinhas clássicas da banca examinadora.</p>
    
    <div class="highlight-box">
      <p>👉 Me responda a este e-mail com uma única frase:<br>
      <em>Qual é a matéria ou assunto que mais te tira o sono hoje, e quando você pretende fazer essa prova?</em></p>
    </div>
    
    <p>Eu leio e respondo pessoalmente cada resposta para que possamos calibrar o Copiloto Cognitivo exatamente nos seus pontos cegos.</p>
    
    <p>Bons estudos e conte comigo em cada etapa da sua aprovação.</p>
    
    <div class="footer">
      <p class="author-title">Lucas Barbosa</p>
      <p class="author-role">Fundador & Arquiteto Chefe &bull; Learning-AI / AprovaLens</p>
      <p style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
        São Paulo, Brasil &bull; <a href="https://aprovalens.com.br" style="color: #3b82f6; text-decoration: none;">aprovalens.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Gatilho de Envio Automático do E-mail de Boas-Vindas
 * Suporta Resend, Sendgrid ou Mock em desenvolvimento
 */
export async function triggerWelcomeEmail(params: WelcomeEmailParams): Promise<WelcomeEmailResult> {
  const subject = `Sua preparação para ${params.targetExam || 'o concurso'} começa hoje (uma pergunta rápida)`;
  const textContent = generateWelcomeEmailText(params);
  const htmlContent = generateWelcomeEmailHtml(params);

  // Se houver chave da API do Resend configurada no ambiente
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Lucas do AprovaLens <lucas@aprovalens.com.br>',
          to: [params.email],
          reply_to: 'lucas@aprovalens.com.br',
          subject,
          text: textContent,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[WelcomeEmail] Falha ao disparar via Resend:', errorData);
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[WelcomeEmail] Erro de rede Resend:', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  }

  // Fallback de Desenvolvimento / Mock Seguro (Registra no console sem quebrar fluxo)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✉️  [MOCK WELCOME EMAIL TRIGGERED]');
  console.log(`Para: ${params.email} (${params.name})`);
  console.log(`Assunto: ${subject}`);
  console.log(`Concurso Alvo: ${params.targetExam || 'Geral'}`);
  console.log('─────────────────────────────────────────────────────────────────────');
  console.log(textContent);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return {
    success: true,
    messageId: `mock_email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  };
}
