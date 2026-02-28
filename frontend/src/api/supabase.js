import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Fail gracefully if keys are missing (to prevent white screen)
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: "Supabase keys missing. Check .env file." } }),
            signUp: async () => ({ error: { message: "Supabase keys missing. Check .env file." } }),
            signOut: async () => ({}),
        },
        from: () => ({ select: () => ({ data: [], error: null }) }) // Mock DB calls
    };

