FROM node:16-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo

FROM base as pruner
# Set working directory
WORKDIR /app
COPY . .
RUN turbo prune --scope=kiosk-web --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
RUN chmod +x /app/scripts/cleanup-extensions.sh
RUN /app/scripts/cleanup-extensions.sh /app/out --keep-next
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS project
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

FROM project as deps
WORKDIR /app
RUN corepack enable
COPY /patches ./patches
RUN yarn install --frozen-lockfile

# Setup production node_modules
FROM project as production-deps
WORKDIR /app
RUN corepack enable
COPY /patches ./patches
RUN yarn install --production

# Build the project
FROM project as builder

WORKDIR /app
ARG TURBO_TOKEN
ARG TURBO_TEAM
COPY --from=pruner /app/out/full/ /app
COPY --from=deps /app/node_modules /app/node_modules
COPY turbo.json turbo.json
COPY .env .env
RUN turbo run build --filter=kiosk-web...
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/kiosk-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/kiosk-web/.next/static ./apps/kiosk-web/.next/static
COPY --from=builder /app/apps/kiosk-web/public ./apps/kiosk-web/public
 
CMD ["node","--trace-warnings", "./apps/kiosk-web/server.js"]