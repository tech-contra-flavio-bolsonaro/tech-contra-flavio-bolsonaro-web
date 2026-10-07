type SupabaseEnvironment = Record<string, string | undefined>;

export function resolveServerSupabaseUrl(environment: SupabaseEnvironment = process.env) {
  return environment.SUPABASE_URL_INTERNAL ?? environment.NEXT_PUBLIC_SUPABASE_URL;
}
