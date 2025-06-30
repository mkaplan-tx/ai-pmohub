#!/usr/bin/env bash
set -e

# 1) Start Postgres (if you really need it inside the container)
#    * Codex containers run as root, so this works here but would fail elsewhere
apt-get update
apt-get install -y postgresql
service postgresql start

# 2) Create the DB & role (no IF NOT EXISTS in Postgres)
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='ai-pmohub'" \
  | grep -q 1 || sudo -u postgres createdb -O postgres ai-pmohub

# 3) Install & generate Prisma
npm ci
npx prisma generate

# 4) Push schema
npx prisma db push --accept-data-loss
