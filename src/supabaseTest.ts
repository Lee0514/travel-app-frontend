import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test1@example.com',
    password: '12345'
  })

  if (error) {
    console.error(error)
    return
  }

}

login()
