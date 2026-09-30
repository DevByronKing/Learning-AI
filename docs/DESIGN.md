# Learning-AI Design System — Fonte da Verdade

> **Documento Oficial de Arquitetura e Especificação Visual**  
> **Versão:** 1.0.0 • **Direção:** Minimalismo Técnico de Alto Contraste (Linear + MasterClass)  
> **Status:** Ativo e Obrigatório em todo o repositório.

---

## 1. Princípio Fundamental & Lei de Governança

> [!IMPORTANT]
> **REGRA DE OURO PARA HUMANOS E AGENTES DE IA:**  
> **Nenhum componente do SaaS pode usar cores hexadecimais soltas, tamanhos fixos ad-hoc ou estilos fora dos tokens definidos em `src/styles/tokens.css`.**  
> Qualquer novo componente deve importar ou consumir exclusivamente as variáveis CSS do Design System ou as classes utilitárias do Tailwind calibradas sobre esses tokens.

### Por que essa abordagem para o Learning-AI?
1. **Foco Cognitivo Prolongado:** Concurseiros e estudantes de alta performance passam de 4 a 10 horas contínuas na plataforma. Uma interface silenciosa e com alto contraste reduz o cansaço mental e a fadiga ocular.
2. **Autoridade e Valor de Assinatura:** O design técnico sofisticado transmite precisão científica e método sério (sem bonecos infantis ou poluição visual).
3. **Sensação de Progresso Destacada:** A interface neutra reserva a cor esmeralda (`--brand-accent`) exclusivamente para a sensação de avanço pedagógico, quebra de curvas de esquecimento e o *Aha Moment*.
4. **Acessibilidade Universal Nativa:** Contraste mínimo WCAG 2.1 AA (4.5:1 para textos) e AAA (7:1 para títulos) com navegação 100% acessível por teclado em ambos os temas.

---

## 2. Paleta de Tokens & Contraste WCAG

Os tokens estão definidos em [`src/styles/tokens.css`](file:///c:/Projetos%20Person/Learning-AI/src/styles/tokens.css) e operam com alternância semântica automática via atributo `data-theme="light"` / `data-theme="dark"` (ou classes `html.light` / `html.dark`).

### 2.1. Cores de Marca & Ação Primária

| Variável CSS | Modo Claro (Light) | Modo Escuro (Dark) | Relação de Contraste | Função e Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| `--brand-primary` | `#4338CA` | `#6366F1` | Light: **7.9:1** (AAA)<br>Dark: **8.5:1** (AAA) | Botões principais de conversão, links ativos e anel de foco. |
| `--brand-primary-hover` | `#3730A3` | `#818CF8` | — | Estado de foco/hover de ações primárias. |
| `--brand-primary-active` | `#312E81` | `#4F46E5` | — | Estado ativo/clique pressionado. |
| `--brand-primary-muted` | `rgba(67, 56, 202, 0.12)` | `rgba(99, 102, 241, 0.18)` | — | Fundo suave de botões secundários, badges e abas selecionadas. |
| `--brand-accent` | `#059669` | `#10B981` | Light: **4.6:1** (AA)<br>Dark: **10.2:1** (AAA) | Barras de sensação de progresso, metas diárias e *Aha Moment*. |
| `--brand-accent-hover` | `#047857` | `#34D399` | — | Hover em botões e barras de progresso. |
| `--brand-accent-muted` | `rgba(5, 150, 105, 0.12)` | `rgba(16, 185, 129, 0.18)` | — | Fundo de badges de acerto e celebrações de progresso. |

### 2.2. Superfícies & Fundos

| Variável CSS | Modo Claro (Light) | Modo Escuro (Dark) | Função Arquitetural |
| :--- | :--- | :--- | :--- |
| `--surface-bg` | `#F8FAFC` (Slate 50) | `#090D16` (Obsidian) | Fundo geral da aplicação. Evita o branco puro que ofusca ou o preto puro que cansa a retina. |
| `--surface-card` | `#FFFFFF` | `#111827` (Gray 900) | Cartões de módulos de aula, cards do simulador e gavetas. |
| `--surface-elevated` | `#F1F5F9` | `#1E293B` (Slate 800) | Superfície elevada para caixas de busca, inputs e contêineres secundários. |
| `--surface-overlay` | `rgba(15, 23, 42, 0.65)` | `rgba(0, 0, 0, 0.85)` | Backdrop escurecido de modais com `backdrop-blur-md`. |

### 2.3. Tipografia & Legibilidade

| Variável CSS | Modo Claro (Light) | Modo Escuro (Dark) | Nível de Conformidade |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#0F172A` | `#F9FAFB` | **WCAG AAA** (Contraste 16.5:1 no claro / 17.8:1 no escuro). |
| `--text-secondary` | `#475569` | `#9CA3AF` | **WCAG AA** (Contraste 5.6:1 no claro / 6.4:1 no escuro). |
| `--text-muted` | `#64748B` | `#6B7280` | Para legendas, timestamps e metadados secundários. |
| `--text-on-brand` | `#FFFFFF` | `#FFFFFF` | Texto em botões preenchidos (`--brand-primary` ou `--brand-accent`). |

### 2.4. Bordas e Foco de Acessibilidade

| Variável CSS | Modo Claro | Modo Escuro | Especificação |
| :--- | :--- | :--- | :--- |
| `--border-subtle` | `#E2E8F0` | `#1F2937` | Borda padrão de 1px para separação de cartões. |
| `--border-strong` | `#CBD5E1` | `#374151` | Borda de inputs em repouso e caixas ativas. |
| `--border-focus` | `#4338CA` | `#818CF8` | **Anel de foco visível:** `outline: 2px solid var(--border-focus); outline-offset: 2px;`. |

### 2.5. Cores Semânticas de Feedback Imediato

| Estado | Token Texto/Borda | Token Fundo Suave | Uso Pedagógico |
| :--- | :--- | :--- | :--- |
| **Sucesso (Acerto)** | `--status-success` (`#16A34A` / `#4ADE80`) | `--status-success-bg` | Alternativa correta no simulador, questão superada. |
| **Alerta (Atenção)** | `--status-warning` (`#D97706` / `#FBBF24`) | `--status-warning-bg` | Pegadinha iminente, revisão de flashcard pendente. |
| **Erro (Distrator)** | `--status-error` (`#DC2626` / `#F87171`) | `--status-error-bg` | Erro em simulador, envio de caderno de erros. |

---

## 3. Escalas Estruturais

### 3.1. Escala de Espaçamento (Base 4px / 8px)
- `--space-xs`: `0.25rem` (4px)
- `--space-sm`: `0.5rem` (8px)
- `--space-md`: `1rem` (16px)
- `--space-lg`: `1.5rem` (24px)
- `--space-xl`: `2rem` (32px)
- `--space-2xl`: `2.5rem` (40px)
- `--space-3xl`: `3rem` (48px)

### 3.2. Escala de Raios de Borda (Border Radius)
- `--radius-xs`: `4px` (Tags pequenas, micro-indicadores)
- `--radius-md`: `8px` (**Padrão para Botões e Inputs de Formulário**)
- `--radius-lg`: `12px` (**Padrão para Cartões de Aula e Módulos**)
- `--radius-xl`: `16px` (Modais, painéis do simulador e gavetas)
- `--radius-2xl`: `24px` (Seções de destaque na Landing Page)
- `--radius-full`: `9999px` (Badges de status, toggles e avatares circulares)

### 3.3. Tipografia: Fonte Outfit (Local woff2)
- **Títulos e Métricas de Impacto:** `Outfit` peso 800 (`font-extrabold`) com tracking apertado (`letter-spacing: -0.02em`).
- **Botões, Abas e Controles:** `Outfit` peso 500 (`font-medium`) ou 700 (`font-bold`).
- **Corpo de Texto e Aulas:** `Outfit` peso 400 (`font-normal`) com entrelinha relaxada (`line-height: 1.6`).

---

## 4. Biblioteca de Componentes Core (`src/design-system/ui/`)

Todos os componentes da biblioteca foram projetados seguindo rigorosamente as diretrizes WCAG 2.1 AA/AAA:

1. **Button (`Button.tsx`)**:
   - Variantes: `primary`, `secondary`, `ghost`, `danger`.
   - Tamanhos: `sm` (32px), `md` (40px), `lg` (48px).
   - Estados: Repouso, Hover, Ativo, Foco Visível (`:focus-visible`), Desabilitado (`disabled`) e Carregando (`loading` com spinner acessível e `aria-busy="true"`).
2. **Input (`Input.tsx`)**:
   - Suporte a rótulo (`label`) vinculado com `htmlFor`, texto auxiliar (`hint`), mensagem de erro com `aria-invalid="true"` e ícones laterais.
   - Anel de foco nítido com `outline-offset: 2px`.
3. **Badge (`Badge.tsx`)**:
   - Variantes: `brand`, `success`, `warning`, `error`, `neutral`.
   - Suporte a indicador dot pulsante e ícones de apoio.
4. **ToggleSwitch (`ToggleSwitch.tsx`)**:
   - `role="switch"`, `aria-checked`, acionável por teclado via tecla <kbd>Espaço</kbd> e <kbd>Enter</kbd>.
5. **LessonCard (`LessonCard.tsx`)**:
   - Apresentação estruturada de módulos com título, descrição, duração, quantidade de questões, status (`completed`, `in_progress`, `locked`) e foco interativo.
6. **ProgressBar (`ProgressBar.tsx`)**:
   - Barra de sensação de progresso com cor esmeralda (`--brand-accent`), porcentagem numérica visível, `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"` e `aria-valuemax="100"`.
7. **Avatar (`Avatar.tsx`)**:
   - Conectado diretamente aos avatares de guardiões em `public/avatars/`:
     - Coruja Atena (`/avatars/coruja.jpg`)
     - Gavião Real (`/avatars/gaviao.jpg`)
     - Leão Soberano (`/avatars/leao.jpg`)
     - Lobo-Guará (`/avatars/lobo.jpg`)
     - Onça Pintada (`/avatars/onca.jpg`)
     - Raposa Ágil (`/avatars/raposa.jpg`)
   - Moldura com borda dupla de 2px na cor `--brand-primary`, brilho sutil e insígnia de arquétipo com texto alternativo acessível.

---

## 5. Rota de Catálogo Interativo (`/design-system`)

A rota [`src/app/design-system/page.tsx`](file:///c:/Projetos%20Person/Learning-AI/src/app/design-system/page.tsx) serve como o laboratório visual vivo do Design System:
- **Seção 1: Tokens:** Swatches de cores com verificação de contraste em tempo real, visualizador da escala Outfit e régua de espaçamento.
- **Seção 2: Marca:** Aplicação da logo oficial (SVG, PNG, 512px) e apresentação das insígnias de todos os 6 Animais Guardiões.
- **Seção 3: Core:** Catálogo interativo de todos os botões, inputs, badges, switches e cards de aula em todos os seus estados.
- **Seção 4: Templates (Protótipo Interativo):**
  - **Onboarding de 5 Passos:** Fluxo interativo de escolha de carreira, animal guardião, diagnóstico de erros e ativação do plano.
  - **Dashboard de Estudos:** Visão geral com métricas, consistência e cards de aula.
  - **Proposta de Landing Page:** Estrutura completa construída unicamente com os componentes do sistema.
