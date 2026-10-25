---
name: sete-leis-ux-arquitetura-tela
description: Diretrizes obrigatórias de engenharia de UI/UX baseadas nas 7 Leis de UX (Fitts, Hick, Zeigarnik, Jakob, Gradiente de Meta, Von Restorff e Miller). Aplique ao criar, revisar ou refatorar qualquer página, dashboard, menu, tela de preços ou fluxo de usuário.
---

# Diretrizes de Engenharia de Tela: As 7 Leis de UX

Princípio Central: **Tela boa faz o cliente pensar menos.** Todo componente e layout construído neste projeto deve obedecer às seguintes regras técnicas:

## 1. Lei de Fitts (Ação Principal Perto e Grande)
- **Regra:** O tempo para atingir um alvo depende da distância e do tamanho dele.
- **Implementação:** O Call-to-Action (CTA) principal da tela deve ter dimensões generosas (altura mínima de `48px` no mobile, padding amplo) e estar posicionado na área de foco imediato (centro visual ou fixo na zona do polegar no mobile).
- **Proibido:** Esconder a ação principal em cantos distantes, menus dropdown ocultos ou usar botões pequenos para conversões críticas.

## 2. Lei de Hick (Menos Escolhas, Menos Atrito)
- **Regra:** Quanto mais opções na tela, maior o tempo de decisão e a chance de desistência.
- **Implementação:** Limite decisões simultâneas (ex: no máximo 2 a 3 planos em telas de preços; no máximo 3 a 4 ações rápidas por card). Use *Progressive Disclosure* (revelação progressiva) para esconder configurações avançadas em abas ou modais secundários.

## 3. Efeito Zeigarnik (Tarefa à Vista para Puxar Conclusão)
- **Regra:** Tarefas iniciadas e não concluídas geram tensão cognitiva que motiva o fechamento.
- **Implementação:** Em fluxos de ativação, onboarding ou metas diárias, implemente um componente de Checklist Visível (ex: "Primeiros passos: 4/5 concluídos") onde o primeiro passo já venha marcado como concluído (ex: "Criar conta [x]").

## 4. Lei de Jakob (Padrões que o Usuário Já Conhece)
- **Regra:** O usuário espera que o sistema funcione como os aplicativos que ele já usa todos os dias.
- **Implementação:** Mantenha convenções universais de UI:
  - Busca sempre no topo com ícone de lupa (`Search`).
  - Notificações com ícone de sino (`Bell`) no cabeçalho.
  - Perfil e Configurações no canto superior direito ou no final da barra lateral.
- **Proibido:** Reinventar ícones, mudar comportamentos padrão de navegação ou criar layouts experimentais que exijam curva de aprendizado.

## 5. Gradiente de Meta (Progresso Visível)
- **Regra:** A motivação humana acelera conforme a pessoa enxerga que está perto do fim.
- **Implementação:** Em qualquer jornada de múltiplos passos (cadastro, configuração, simulado, bateria de estudo), renderize uma barra de progresso contínua mostrando a porcentagem atual e adicione microcopy dinâmico de incentivo acima de 75% (ex: "Falta pouco!", "Quase lá!").

## 6. Efeito Von Restorff (Um Destaque Só por Tela)
- **Regra:** Se tudo grita na tela com cores vibrantes, nada aparece. O elemento diferente só se destaca se o redor for neutro.
- **Implementação:** Deve existir **apenas 1 botão com estilo Primário (cor sólida de destaque)** por seção/tela. Todas as ações secundárias ("Compartilhar", "Exportar", "Ver detalhes", "Agendar") devem usar variantes neutras (`secondary`, `outline` ou `ghost`).

## 7. Lei de Miller (Agrupamento / Chunking — Uma Decisão por Vez)
- **Regra:** A memória de trabalho suporta no máximo ~7 elementos isolados (idealmente de 3 a 5 grupos).
- **Implementação:** Nunca renderize listas ou barras de navegação com mais de 7 itens soltos do mesmo peso visual. Agrupe métricas, links e configurações em **3 a 4 categorias claras** (cards ou seções com títulos visíveis) e solicite apenas uma decisão por vez ao usuário.
