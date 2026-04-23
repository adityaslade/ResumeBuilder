import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cbcginlxrbopmglhkccm.supabase.co'
const supabaseAnonKey = 'sb_publishable_Ou7q54ofTgPKZ9PViIezIg_UoRO0yWV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
