#!/bin/sh
set -eu

cleanup() {
  supabase stop --no-backup || true
}

trap 'cleanup; exit 0' INT TERM

mkdir -p /runtime supabase/functions
# The named runtime volume survives `docker compose down` without `-v`.
# Clear readiness artifacts from prior runs before the migration/seed cycle.
rm -f /runtime/ready /runtime/supabase.env

cat > supabase/functions/.env <<'EOF'
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
EOF

if ! supabase start --exclude studio,imgproxy,mailpit,logflare,vector,supavisor,realtime > /tmp/supabase-start.log 2>&1; then
  sed -E 's/(Secret[[:space:]]*│)[^│]*/\1 [redacted]/; s/(Publishable[[:space:]]*│)[^│]*/\1 [redacted]/; s/(Access Key[[:space:]]*│)[^│]*/\1 [redacted]/; s/(Project URL[[:space:]]*│)[^│]*/\1 [redacted]/' /tmp/supabase-start.log >&2
  exit 1
fi
supabase db reset --local
supabase status --output env > /runtime/supabase.env
touch /runtime/ready

while :; do
  sleep 3600 &
  wait $!
done
