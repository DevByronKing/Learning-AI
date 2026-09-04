# Learning-AI (AprovaLens AI)

> O Copiloto Cognitivo para Concursos Públicos, OAB e ENEM — Dissecção de Editais, Caderno de Erros, Simulador com IA e Ciclos Adaptativos de Estudo.

---

## 🚀 Visão Geral

O **Learning-AI (AprovaLens AI)** é uma plataforma educacional de alta performance desenvolvida para concurseiros e estudantes de exames de ordem (OAB). O sistema transcende métodos tradicionais de estudo ao incorporar:

1. **Parser & Verticalizador de Editais por IA:** Extração automatizada de disciplinas, pesos e cálculo de relevância estatística da banca (Cebraspe, FGV, Vunesp, FCC).
2. **Simulador com Diagnóstico Cognitivo:** Análise de causa-raiz do erro do aluno (Pegadinha de Banca, Lacuna Teórica, Leitura Apressada, Curva de Esquecimento) com jurisprudência e artigos vinculados.
3. **Player de Repetição Espaçada SRS (SM-2):** Memorização ativa baseada na Curva do Esquecimento de Ebbinghaus, com atalhos de teclado (Espaço / 1-4) e exportador nativo de decks para o **Anki** (`.txt` / `.tsv`).
4. **Caderno de Erros Inteligente & Modo Revanche:** Catalogação de distratores falhados, anotações de estudo e repetição focada de questões incorretas.
5. **Estúdio de Redação Discursiva:** Temas de bancas anteriores, contagem de linhas, cronômetro de prova e correção por IA com espelho de nota.
6. **Smart Vade Mecum:** Legislação seca (CF/88, Lei 8.112, LIA, Licitações, etc.) com remissão direta a questões de prova.
7. **Ciclos de Estudos Adaptativos:** Metodologia Alexandre Meirelles integrada com pomodoro e metas de carga horária.
8. **Checkout & Monetização:** Integração com Pix dinâmico e cartão de crédito para os planos *Aspirante*, *Concurseiro Elite* e *Tribunal Master*.
9. **SEO Programático:** Rotas dinâmicas públicas (`/edital/[slug]`) preparadas para indexação orgânica no Google com captura de leads.

---

## 🛠️ Stack Tecnológica

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router + Turbopack), [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Estilização:** [TailwindCSS](https://tailwindcss.com/) com paleta Cyber-Dark executiva
- **Gráficos & Analytics:** [Recharts](https://recharts.org/)
- **Ícones & Microinterações:** [Lucide React](https://lucide.dev/), Canvas Confetti
- **Backend & Persistência:** [Supabase](https://supabase.com/) (PostgreSQL com RLS + Supabase Auth) com suporte a fallback Offline-First (`localStorage`)
- **Versionamento & Deploy:** Git, Vercel ready

---

## ⚡ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Git

### 1. Clonar o Repositório
```bash
git clone https://github.com/DevByronKing/Learning-AI.git
cd Learning-AI
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```
Preencha as variáveis com suas credenciais do Supabase e OpenAI (opcional):
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
OPENAI_API_KEY=sk-proj-...
```

### 4. Executar em Modo de Desenvolvimento
No Windows, basta dar um duplo clique em `iniciar_dev.bat` ou executar:
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 5. Compilar para Produção
```bash
npm run build
npm start
```

---

## 🗄️ Modelagem de Banco de Dados (Supabase)

O script DDL completo para provisionamento no PostgreSQL está em:
```
supabase/schema.sql
```
Contém tabelas com Row Level Security (RLS) para:
- `profiles` (estudantes e metas)
- `exam_notices` (editais e pesos)
- `questions` (banco de questões)
- `question_attempts` (diagnóstico cognitivo)
- `flashcards` (decks do SM-2)
- `mistakes_notebook` (caderno de erros)

---

## 📄 Licença

Projeto sob licença proprietária de desenvolvimento. Todos os direitos reservados.
