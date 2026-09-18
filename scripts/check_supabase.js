const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hdwglipsfqxgnbwcymxn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.log('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY não definida no ambiente. Defina no .env.local para testar.');
  process.exit(0);
}

const client = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Testing connection to Supabase (' + supabaseUrl + ')...');
  
  const tablesToCheck = [
    'profiles',
    'exam_notices',
    'questions',
    'mistakes_notebook',
    'flashcards',
    'study_cycles',
    'question_attempts',
    'discursive_submissions'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error, status } = await client.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table [${table}]: Error (${error.code}) - ${error.message}`);
      } else {
        console.log(`✅ Table [${table}]: OK (status ${status}, found ${data ? data.length : 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ Table [${table}]: Exception - ${err.message}`);
    }
  }
}

checkDatabase();
