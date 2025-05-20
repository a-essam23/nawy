FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first to leverage layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install pnpm and create non-root user
RUN npm install -g pnpm

# Install only production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy only necessary files from build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./ 
COPY --from=builder /app/.env* ./ 


EXPOSE 3000
CMD ["pnpm", "start"]