import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do seu ficheiro .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validação para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseKey) {
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias.');
}

// Cria e exporta o cliente Supabase para ser usado nas suas rotas
export const supabase = createClient(supabaseUrl, supabaseKey);