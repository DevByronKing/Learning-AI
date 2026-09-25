import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';

export async function POST(req: Request) {
  try {
    // Proteção contra abuso e flood de requisições
    const ip = getClientIp(req);
    const { allowed, resetTime } = checkRateLimit(ip, 20, 60000);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limite de requisições excedido. Aguarde 1 minuto para enviar novas perguntas ao Copiloto.',
          retryAfterSeconds: Math.ceil((resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    const body = await req.json();
    const {
      query = '',
      studentProfile = {},
      examContext = {},
      history = []
    } = body;

    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Pergunta em branco.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    const warName = studentProfile.warName || studentProfile.name || 'Guerreiro(a)';
    const targetExam = studentProfile.targetExamTitle || examContext.title || 'Concurso Público';
    const banca = studentProfile.targetBanca || examContext.banca || 'Cebraspe';
    const weakSubject = studentProfile.weakSubject || 'Direito Administrativo';
    const hours = studentProfile.dailyHoursGoal || 4;

    // Se a chave não estiver no servidor, fallback heurístico de alta qualidade
    if (!apiKey) {
      const fallbackResponse = generateHeuristicResponse(query, warName, targetExam, banca, weakSubject);
      return NextResponse.json({
        success: true,
        source: 'heuristic_fallback',
        ...fallbackResponse
      });
    }

    const systemPrompt = `Você é o Copiloto Cognitivo de Alta Performance do Learning AI, mentor pessoal do aluno(a) ${warName}.
PERFIL DO ALUNO:
- Cargo/Edital Alvo: ${targetExam}
- Banca Examinadora: ${banca}
- Calcanhar de Aquiles Declarado: ${weakSubject}
- Meta Diária: ${hours} horas líquidas de estudo

SUA MISSÃO:
1. Responder com clareza cristalina, didática ágil e tom encorajador e estratégico (estilo treinador de elite / mentor de aprovação).
2. Se a dúvida for sobre legislação ou direito, use as leis ATUALIZADAS (ex: Nova Lei de Licitações 14.133/21, Nova LIA 14.230/21, CF/88, Lei 8.112/90).
3. Se a dúvida envolver bancas (${banca}), explique a "malícia" ou a pegadinha clássica dessa banca.
4. Mantenha a resposta concisa (2 a 4 parágrafos objetivos com tópicos em markdown).
5. Sugira uma ação prática (qual aba o aluno deve abrir: 'simulator' (Arena), 'cycle' (Ciclo de Estudos), 'mistakes' (Caderno de Erros), 'vademecum' (Leis), 'summaries' (Resumos)).

Responda em JSON rigoroso com a estrutura:
{
  "text": "Sua resposta completa em Markdown...",
  "quickAction": {
    "label": "Rótulo do Botão de Ação (ex: '⚔️ Treinar Questões na Arena')",
    "actionTab": "simulator" | "cycle" | "mistakes" | "vademecum" | "summaries"
  }
}`;

    const recentHistoryText = Array.isArray(history)
      ? history.slice(-4).map((h: any) => `${h.sender === 'user' ? 'Aluno' : 'Copiloto'}: ${h.text}`).join('\n')
      : '';

    const prompt = `${systemPrompt}\n\nHISTÓRICO RECENTE:\n${recentHistoryText}\n\nPERGUNTA DO ALUNO:\n"${query}"\n\nResponda estritamente em JSON:`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
              responseMimeType: 'application/json'
            }
          })
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Gemini status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Resposta vazia da API Gemini');
    }

    const parsed = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      source: 'gemini',
      text: parsed.text || 'Processamento concluído com sucesso.',
      quickAction: parsed.quickAction || { label: '⚔️ Ir para a Arena', actionTab: 'simulator' }
    });
  } catch (error: any) {
    console.error('API Copilot Error:', error);
    // Fallback gracioso
    return NextResponse.json({
      success: true,
      source: 'fallback',
      text: `### Orientação Tática do Copiloto:\n\nPara maximizar seu rendimento no edital alvo com a banca examinadora, mantenha foco nos artigos literais mais cobrados e na repetição espaçada das questões que você errou.\n\n* **Regra 60/40**: Concentre o primeiro bloco de hoje na sua disciplina vulnerável.\n* **Fixação**: Resolva no mínimo 15 questões antes de passar para nova teoria.`,
      quickAction: { label: '⚔️ Atacar na Arena de Questões', actionTab: 'simulator' }
    });
  }
}

function generateHeuristicResponse(
  query: string,
  warName: string,
  targetExam: string,
  banca: string,
  weakSubject: string
) {
  const lower = query.toLowerCase();

  if (lower.includes('cebraspe') || lower.includes('fgv') || lower.includes('banca')) {
    return {
      text: `### Raio-X Estratégico — ${banca} vs Outras Bancas\n\n* **Cebraspe (C/E)**: Extremamente semântica. O examinador elabora 3 linhas impecáveis e altera uma única conjunção restritiva no final (*"sempre"*, *"prescinde"*, *"exclusivamente"*). 1 errada anula 1 certa: se a incerteza persistir, a tática correta é deixar em branco!\n* **FGV**: Constrói situações-problema complexas e longas. A armadilha reside no excesso de detalhes irrelevantes para esgotar o tempo de prova.\n\n🎯 **Para o seu alvo (${targetExam})**: Domine os distratores clássicos da banca.`,
      quickAction: { label: `⚔️ Treinar Simulado ${banca}`, actionTab: 'simulator' }
    };
  }

  if (lower.includes('8.112') || lower.includes('posse') || lower.includes('exercício')) {
    return {
      text: `### Mnemônico de Prazos — Lei 8.112/90:\n\n* **Nomeação ➔ Posse**: **30 dias** (improrrogáveis). Não tomou posse? O ato é tornado sem efeito!\n* **Posse ➔ Exercício**: **15 dias** (improrrogáveis). Tomou posse mas não entrou em exercício? **DEMISSÃO? NÃO! O servidor é EXONERADO!**\n\n💡 **Mnemônico**: *P-O-S-S-E (30 dias) ➔ E-X-E-R-C-Í-C-I-O (15 dias)*.`,
      quickAction: { label: '📖 Consultar Lei 8.112 no Vade Mecum', actionTab: 'vademecum' }
    };
  }

  if (lower.includes('14.230') || lower.includes('improbidade') || lower.includes('lia')) {
    return {
      text: `### 3 Pilares Indispensáveis da Reforma da Improbidade (Lei 14.230/21):\n\n1. **Fim da Culpa**: Não existe ato ímprobo culposo (nem mesmo por negligência gravíssima). Exige-se sempre **dolo específico**.\n2. **Rol do Art. 11 agora é TAXATIVO**: Se a conduta que fere princípios não estiver listada expressamente, não configura improbidade pelo art. 11.\n3. **Prazo Prescricional Unificado**: 8 anos contados a partir da data em que o fato ocorreu.`,
      quickAction: { label: '📝 Ver Questões no Caderno de Erros', actionTab: 'mistakes' }
    };
  }

  return {
    text: `Olá, **${warName}**! Analisando seu progresso para **${targetExam}**:\n\n* **Foco Imediato**: Seu calcanhar de aquiles declarado é **${weakSubject}**. Recomendamos dedicar 60% do seu bloco de hoje a esse tema.\n* **Consolidação**: A cada 10 questões resolvidas na Arena, registre os distratores no Caderno de Erros para revisão programada via SM-2.\n\nComo posso apoiar você especificamente neste tópico agora?`,
    quickAction: { label: `⚔️ Atacar ${weakSubject} na Arena`, actionTab: 'simulator' }
  };
}
