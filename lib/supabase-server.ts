/**
 * Supabase client for server-side operations (API routes, webhooks)
 * Uses service role key for full database access
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Server-side Supabase client with service role permissions
 * Use this in API routes and webhooks
 * 
 * Note: Variables are checked at runtime, not build time, to allow builds to succeed
 * even if env vars are not set (they will be set in Netlify)
 */
export const supabaseServer = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : // Fallback client that will fail at runtime if used without proper env vars
    createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

