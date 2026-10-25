# PRD-02: Onboarding Cognitivo & Ativação D0 Instantânea

## 1. Visão Geral
Fluxo guiado de 5 etapas para qualificação rápida do perfil do concurseiro, persistência anti-quedas em conexões móveis e direcionamento imediato para a primeira sessão de estudo sem bloqueio de paywall na largada.

## 2. Requisitos Funcionais
1. **Modelo de 1 Pergunta por Tela**: Etapas segmentadas (Mapeamento da Ferida, Alvo & Adversário, Calcanhar de Aquiles, Guardião Cognitivo e Veredito/Passaporte).
2. **Persistência Anti-Queda no 4G**: Salvar o estado de cada seleção imediatamente em `localStorage` sob a chave `argus_onboarding_draft`.
3. **Botão Voltar com Memória**: Navegar para trás recupera exatamente as seleções prévias sem perda de dados.
4. **Gradiente de Meta**: Microcopy motivacional ("⚡ Quase lá! Falta pouco!") ativado a partir da etapa 4.
5. **Ativação D0 Direta**: Ao concluir o onboarding, direcionar o aluno para `setActiveTab('simulator')` com seu edital alvo calibrado, dispensando bloqueio inicial de paywall.

## 3. Critérios de Aceite (Acceptance Criteria)
- [x] O rascunho temporário é salvo em tempo real e limpo após a conclusão do cadastro.
- [x] O usuário nunca encontra telas em branco ou estados vazios pós-onboarding.
- [x] O edital alvo selecionado no cadastro torna-se o padrão da sessão.
- [x] Testes unitários para persistência, recuperação e limpeza do draft devem passar com 100% de sucesso.
