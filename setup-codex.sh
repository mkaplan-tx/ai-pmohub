#!/usr/bin/env bash
set -euo pipefail

# 1) Install & start Postgres
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y postgresql postgresql-client

service postgresql start

# 2) Ensure the ai-pmohub database exists
if ! sudo -iu postgres psql -lqt \
       | cut -d \| -f 1 \
       | grep -qw ai-pmohub
then
  echo "Creating ai-pmohub database..."
  sudo -u postgres createdb -O postgres ai-pmohub
else
  echo "Database ai-pmohub already exists; skipping creation."
fi

# 3) Install JS deps & generate Prisma client
npm ci
npx prisma generate

# 4) Push your Prisma schema
npx prisma db push --accept-data-loss

