import { createClient } from '@supabase/supabase-js'

const supabase = createClient(__SUPABASE_URL__, __SUPABASE_KEY__, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase
