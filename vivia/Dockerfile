# VIVIA production image. Build context: the `vivia/` folder.
FROM node:22-bookworm-slim

# Prisma's query engine needs OpenSSL.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# Dev dependencies are kept on purpose: the Prisma CLI runs migrations at start-up
# and `npm run db:seed` (demo data) needs tsx.
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npx prisma generate && npm run build

# Encrypted documents live here. Mount a persistent disk at /data.
ENV STORAGE_DIR=/data/storage
EXPOSE 3000

# Apply migrations, then serve. PORT is provided by the platform (default 3000).
CMD ["sh", "-c", "npx prisma migrate deploy && npm start -- -H 0.0.0.0 -p ${PORT:-3000}"]
