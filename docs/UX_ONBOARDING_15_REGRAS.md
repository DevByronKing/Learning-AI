# UX e Onboarding: As 15 Regras de Ouro no Argus

> **O Conceito Central: Cadastro Dinâmico vs. "Ficha de Emprego"**  
> O onboarding do Argus não é um formulário burocrático ou ficha de emprego; é uma **anamnese cognitiva de alta precisão**. Cada pergunta altera em tempo real o algoritmo de inteligência artificial, personalizando o ciclo de estudos, a matriz de incidência da banca e o simulador.

---

### Pergunta de Validação do Produto

> *"O QUE essa resposta vai mudar?"*  
> Se a resposta do usuário não alterar nada na experiência prática dele, a pergunta deve ser sumariamente eliminada.

---

### As 15 Regras Aplicadas ao Argus

#### 1. Use as respostas imediatamente na primeira tela
- **Estratégia:** Nunca jogue o aluno em um dashboard genérico e vazio após o cadastro.
- **Aplicação no Argus:** Os dados coletados (Ex: "Polícia Federal", "Cebraspe", "Direito Administrativo") geram imediatamente na primeira tela o ciclo tático de 24h, o Passaporte de Posse com credencial SHA-256 e a primeira bateria de questões adaptativas da banca.

#### 2. Permitir pular etapas
- **Estratégia:** O usuário deve avançar sem preencher dados secundários no primeiro minuto.
- **Aplicação no Argus:** Se o aluno ainda não decidiu o concurso exato, o sistema disponibiliza o botão *"Pular seleção e usar Edital Recomendado (PF / Cebraspe)"*, permitindo que ele experimente a plataforma sem atrito.

#### 3. Pule perguntas irrelevantes (Lógica Condicional)
- **Estratégia:** Oculte campos irrelevantes com base na escolha anterior.
- **Aplicação no Argus:** Ao selecionar um concurso pré-cadastrado (como "TJ-SP"), a banca Vunesp e as matérias centrais de Lei Seca são travadas automaticamente. O campo de digitação manual de concurso só surge caso o aluno marque *"Outro Concurso"*.

#### 4. Escolha é melhor do que digitar
- **Estratégia:** Reduza a digitação no mobile priorizando toque em cards táteis e chips.
- **Aplicação no Argus:** Para a escolha do "Nome de Guerra", o Argus oferece chips rápidos de 1 toque (*"Guerreiro(a)"*, *"Auditor(a)"*, *"Agente"*, *"Doutor(a)"*) além dos cards visuais de matérias e guardiões.

#### 5. Pergunte apenas o que melhora o produto
- **Estratégia:** Elimine perguntas burocráticas (endereço, telefone, estado civil) no primeiro contato.
- **Aplicação no Argus:** O onboarding coleta estritamente 5 variáveis essenciais para o motor de IA: 1) Dor principal, 2) Edital alvo, 3) Disciplina fraca, 4) Horas/dia e 5) Guardião.

#### 6. Peça o e-mail só quando realmente for enviar algo
- **Estratégia:** Evite barrar o usuário com formulário de login antes dele testar a ferramenta.
- **Aplicação no Argus:** O aluno vivencia o diagnóstico psicométrico e a montagem do plano tático primeiro. O e-mail é utilizado no final para envio do Passaporte Cognitivo e preservação do histórico de simulados.

#### 7. Uma pergunta por tela (duas já cansam)
- **Estratégia:** Reduza a carga cognitiva dividindo o fluxo em passos focados e objetivos.
- **Aplicação no Argus:** O modal opera em um stepper visual de 5 etapas individuais, permitindo foco pleno em uma decisão estratégica por vez.

#### 8. Mostre o progresso ("2 de 5")
- **Estratégia:** Incerteza gera abandono; o usuário precisa saber exatamente quanto falta para terminar.
- **Aplicação no Argus:** Barra de progresso superior do Design System (`ProgressBar`) integrada com contador numérico explícito (*"Etapa 2 de 5 • ~30s restantes"*).

#### 9. Explique em uma linha por que está perguntando aquilo
- **Estratégia:** Usuários fornecem informações com muito mais receptividade quando compreendem o ganho em troca.
- **Aplicação no Argus:** Todas as telas trazem um banner explicativo superior via `QUESTION_VALUE_PROPOSITIONS` (ex: *"Mapeamos a disciplina que mais ameaça sua aprovação para priorizá-la no primeiro bloco do seu ciclo de estudos"*).

#### 10. Não peça o que o sistema consiga descobrir sozinho
- **Estratégia:** Elimine perguntas redundantes que a tecnologia detecta em segundo plano.
- **Aplicação no Argus:** A função `autoDetectUserContext()` extrai silenciosamente o fuso horário (`Intl.DateTimeFormat`), idioma do navegador (`navigator.language`) e dispositivo (`mobile` vs `desktop`).

#### 11. Salve a resposta a cada passo
- **Estratégia:** Se a conexão cair ou a aba fechar acidentalmente, o progresso deve ser recuperado.
- **Aplicação no Argus:** As funções `saveOnboardingDraft()` e `loadOnboardingDraft()` salvam cada toque instantaneamente no `localStorage` sob a chave `argus_onboarding_draft`.

#### 12. Deixe voltar e confirme sem perder o que já foi respondido
- **Estratégia:** O botão "Voltar" não pode resetar as escolhas anteriores.
- **Aplicação no Argus:** O botão de retorno reabre a etapa anterior com todas as opções selecionadas intactas e sincronizadas.

#### 13. Nunca peça o cartão de crédito antes de uma pessoa ver valor
- **Estratégia:** Pedir dados de pagamento antes de entregar valor gera alta taxa de rejeição.
- **Aplicação no Argus:** A etapa 5 revela o Passaporte Oficial, o Radar de Vulnerabilidades e o Plano das Primeiras 24 Horas de forma tangível antes de apresentar os botões de assinatura ou trial.

#### 14. Teste o cadastro no 4G ruim, não apenas no Wi-Fi de casa
- **Estratégia:** O fluxo deve ser ultraleve para operar sem travamentos em conexões móveis lentas.
- **Aplicação no Argus:** Zero requisições de rede bloqueantes entre as etapas 1 a 4. O modal opera com transições CSS nativas e assets vetoriais leves.

#### 15. Cronometre o seu fluxo: passou de 60 segundos, corte
- **Estratégia:** O tempo até o valor (Time to Value) deve ser inferior a um minuto.
- **Aplicação no Argus:** O fluxo de 5 etapas com botões de seleção tátil pode ser completado em média entre 30 e 45 segundos.

---

### Módulos de Código Associados

- **Dados e Validação:** [`src/components/onboarding/onboardingData.ts`](file:///c:/Projetos%20Person/Learning-AI/src/components/onboarding/onboardingData.ts)
- **Modal Interativo:** [`src/components/UserOnboardingModal.tsx`](file:///c:/Projetos%20Person/Learning-AI/src/components/UserOnboardingModal.tsx)
- **Suíte de Testes Automatizada:** [`src/__tests__/onboardingData.test.ts`](file:///c:/Projetos%20Person/Learning-AI/src/__tests__/onboardingData.test.ts)
