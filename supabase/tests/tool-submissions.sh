#!/usr/bin/env bash
# Applies the migrations to a throwaway Postgres container and checks the tool_submissions invariants.
# Needs Docker. Usage: bash supabase/tests/tool-submissions.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

name="tool-submissions-test-$$"
image="${POSTGRES_IMAGE:-postgres:16-alpine}"
trap 'docker rm -f "$name" >/dev/null 2>&1 || true' EXIT
docker run -d --name "$name" -e POSTGRES_PASSWORD=test "$image" >/dev/null
until docker exec "$name" pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
sleep 2
psql() { docker exec -i "$name" psql -v ON_ERROR_STOP=1 -q -U postgres "$@"; }

# Supabase provides these roles and the storage schema; the first migration also configures a bucket.
psql <<'SQL'
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
grant usage on schema public to anon, authenticated, service_role;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
SQL
for migration in supabase/migrations/*.sql; do psql < "$migration"; done
psql < supabase/tests/tool_submissions.sql >/dev/null

# Concurrent inserts with the same title must all succeed with distinct slugs.
for i in $(seq 1 12); do
  psql -c "insert into tool_submissions (title, description, category, credit, url) values ('Mesma ferramenta', 'Inserção concorrente.', 'Geral', 'Ana', 'https://example.com')" &
done
wait
psql -At -c "select count(*), count(distinct slug) from tool_submissions where title = 'Mesma ferramenta'" | grep -qx '12|12'
psql < supabase/seed.sql
psql < supabase/tests/tool_seed.sql
echo "tool_submissions SQL checks passed"
