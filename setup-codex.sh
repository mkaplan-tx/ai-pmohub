#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# 1) Install & start Postgres (only if missing)
# -----------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive

if ! command -v psql >/dev/null; then
  echo "📥 Installing PostgreSQL…"
  apt-get update -qq
  apt-get install -y --no-install-recommends postgresql postgresql-client -qq
fi

echo "🚀 Starting PostgreSQL service…"
service postgresql start

# -----------------------------------------------------------------------------
# 2) Configure role password & ensure DB exists (with proper quoting)
# -----------------------------------------------------------------------------
DB_NAME="ai-pmohub"
DB_USER="postgres"
DB_PASS="postgres"

echo "🔐 Setting password for role '${DB_USER}'…"
sudo -u postgres psql -c "ALTER ROLE \"${DB_USER}\" WITH PASSWORD '${DB_PASS}';"

# Trim whitespace around names, then do a fixed-string exact match
if ! sudo -u postgres psql -lqt \
      | cut -d '|' -f1 \
      | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' \
      | grep -Fxq "${DB_NAME}"; then
  echo "🗄️  Creating database \"${DB_NAME}\" (owner: \"${DB_USER}\")…"
  sudo -u postgres psql -c "CREATE DATABASE \"${DB_NAME}\" OWNER \"${DB_USER}\";"
else
  echo "✅  Database \"${DB_NAME}\" already exists — skipping."
fi

# -----------------------------------------------------------------------------
# 3) Install JS deps & generate Prisma client
# -----------------------------------------------------------------------------
echo "📦 Installing npm dependencies…"
unset npm_config_http_proxy npm_config_https_proxy HTTP_PROXY HTTPS_PROXY
npm ci

echo "🔧 Generating Prisma client…"
npx prisma generate

# -----------------------------------------------------------------------------
# 4) Push your Prisma schema to the database
# -----------------------------------------------------------------------------
echo "📑 Pushing Prisma schema to database…"
npx prisma db push --accept-data-loss

echo "🎉 Setup complete!"
