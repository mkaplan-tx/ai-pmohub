#!/usr/bin/env bash
set -euo pipefail

# 1) Install & start Postgres
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y postgresql postgresql-client -qq
service postgresql start

# 2) Ensure the ai-pmohub DB exists
if ! sudo -iu postgres psql -lqt \
      | cut -d '|' -f1 \
      | grep -qw ai-pmohub; then
  echo "🗄️  Creating database ai-pmohub..."
  sudo -u postgres createdb -O postgres ai-pmohub
else
  echo "✅  Database ai-pmohub already exists — skipping."
fi

# 3) Install JS deps & generate Prisma client
echo "📦 Installing npm dependencies…"
npm ci

echo "🔧 Generating Prisma client…"
npx prisma generate

# 4) Push your schema
echo "📑 Pushing Prisma schema to database…"
npx prisma db push --accept-data-loss

echo "🎉 Setup complete!"
