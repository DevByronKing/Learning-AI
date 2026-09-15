-- ==============================================================================
-- LEARNING AI - SUPABASE POSTGRESQL SCHEMA (CUSTO ZERO & ALTA ESCALABILIDADE)
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Profiles Table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  target_exam TEXT,
  study_methodology TEXT DEFAULT 'ciclo_meirelles',
  daily_hours_goal NUMERIC DEFAULT 3.0,
  streak_days INT DEFAULT 1,
  subscription_tier TEXT DEFAULT 'aspirante', -- 'aspirante', 'pro', 'elite'
  subscription_status TEXT DEFAULT 'active',
  avatar_animal TEXT DEFAULT 'coruja', -- 'coruja', 'lobo', 'gaviao', 'leao', 'raposa', 'onca'
  war_name TEXT DEFAULT 'Futuro Servidor',
  daily_ai_requests_count INT DEFAULT 0,
  daily_ai_requests_reset_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Exam Notices (Editais) Table
CREATE TABLE IF NOT EXISTS public.exam_notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  banca TEXT NOT NULL,
  role TEXT NOT NULL,
  salary TEXT,
  vacancies INT,
  exam_date DATE,
  pdf_storage_path TEXT,
  parsed_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Question Bank
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_name TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  banca TEXT NOT NULL,
  year INT NOT NULL,
  institution TEXT NOT NULL,
  statement TEXT NOT NULL,
  code_citation TEXT,
  options JSONB NOT NULL,
  explanation TEXT NOT NULL,
  law_articles TEXT[] DEFAULT '{}',
  cognitive_analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. User Question Attempts & AI Cognitive Diagnosis
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  selected_option_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INT NOT NULL,
  error_type TEXT, -- 'pegadinha_banca', 'lacuna_teorica', 'leitura_apressada', 'curva_esquecimento'
  ai_diagnostic JSONB,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Spaced Repetition Flashcards (Curva de Ebbinghaus / SM-2)
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject_name TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  error_origin_attempt_id UUID REFERENCES public.question_attempts(id) ON DELETE SET NULL,
  error_origin_question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  next_review_date DATE DEFAULT CURRENT_DATE NOT NULL,
  interval_days INT DEFAULT 1 NOT NULL,
  repetitions INT DEFAULT 0 NOT NULL,
  ease_factor NUMERIC DEFAULT 2.5 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Mistakes Notebook (Caderno de Erros Ativo & Modo Revanche)
CREATE TABLE IF NOT EXISTS public.mistakes_notebook (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_personal_note TEXT DEFAULT '',
  is_overcome BOOLEAN DEFAULT false NOT NULL,
  revanche_attempts_count INT DEFAULT 0,
  last_attempt_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. AI Diagnostic Cache (Redução de até 85% no Consumo de Tokens Gemini)
CREATE TABLE IF NOT EXISTS public.ai_diagnostic_cache (
  cache_key TEXT PRIMARY KEY, -- hash md5(question_id || '_' || selected_option_id)
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id TEXT NOT NULL,
  error_type TEXT NOT NULL,
  ai_diagnostic JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Leads Table (Programmatic SEO & Marketing Capture)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  target_edital TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Transactions Table (Asaas Pix / Stripe Checkout)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL,
  pix_code TEXT,
  provider TEXT NOT NULL,
  user_email TEXT NOT NULL,
  external_id TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ==============================================================================
-- 11. ÍNDICES DE ALTA PERFORMANCE (CONSULTAS CRUZADAS SEM TABLE SCANS)
-- ==============================================================================

-- A. Repetição Espaçada: busca ultra-rápida de flashcards devidos no dia
CREATE INDEX IF NOT EXISTS idx_flashcards_user_review 
  ON public.flashcards (user_id, next_review_date);

-- B. Analytics e Diagnóstico: cálculo instantâneo de precisão e pontos cegos
CREATE INDEX IF NOT EXISTS idx_attempts_user_analytics 
  ON public.question_attempts (user_id, is_correct, answered_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempts_question 
  ON public.question_attempts (question_id);

-- C. Caderno de Erros: listagem rápida de erros pendentes de revanche
CREATE INDEX IF NOT EXISTS idx_mistakes_user_status 
  ON public.mistakes_notebook (user_id, is_overcome, last_attempt_date DESC);

CREATE INDEX IF NOT EXISTS idx_mistakes_question 
  ON public.mistakes_notebook (question_id);

-- D. Banco de Questões: filtros por banca, disciplina e ano
CREATE INDEX IF NOT EXISTS idx_questions_banca_subject 
  ON public.questions (banca, subject_name, year DESC);

-- E. Busca Textual Rápida no Enunciado (Trigram GIN)
CREATE INDEX IF NOT EXISTS idx_questions_statement_trgm 
  ON public.questions USING gin (statement gin_trgm_ops);

-- F. Cache de IA: verificação em O(1) de respostas prontas
CREATE INDEX IF NOT EXISTS idx_cache_lookup 
  ON public.ai_diagnostic_cache (cache_key);

-- G. Transações: polling de pagamento por email e status
CREATE INDEX IF NOT EXISTS idx_transactions_user_status 
  ON public.transactions (user_email, status);

-- H. Editais por usuário
CREATE INDEX IF NOT EXISTS idx_exam_notices_user 
  ON public.exam_notices (user_id);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes_notebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_diagnostic_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own editais" ON public.exam_notices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own attempts" ON public.question_attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own flashcards" ON public.flashcards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own mistakes" ON public.mistakes_notebook
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone authenticated can view questions" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone authenticated can read diagnostic cache" ON public.ai_diagnostic_cache
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert to diagnostic cache" ON public.ai_diagnostic_cache
  FOR INSERT WITH CHECK (true);

-- Leads: permit public anonymous insert from SEO landing pages
CREATE POLICY "Public anonymous insert for leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Transactions: permit reading for polling and updates via service key
CREATE POLICY "Public read for transactions polling" ON public.transactions
  FOR SELECT USING (true);
