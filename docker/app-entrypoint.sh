#!/bin/sh
set -eu

runtime_env_file="${SUPABASE_RUNTIME_ENV_FILE:-/runtime/supabase.env}"

while [ ! -s "$runtime_env_file" ]; do
  sleep 1
done

set -a
. "$runtime_env_file"
set +a

export SUPABASE_SECRET_KEY="${SERVICE_ROLE_KEY:?A chave local do Supabase não foi inicializada.}"
export SUPABASE_URL_INTERNAL="${API_URL:?A URL local do Supabase não foi inicializada.}"

exec "$@"
