import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucvabtgmnnvfjjswcyle.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdmFidGdtbm52Zmpqc3djeWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwODgzNDgsImV4cCI6MjA5ODY2NDM0OH0.ejMoOCX7tRRIm5gREsx7EqKEt8fFSvTiP5BaELqfHN0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
