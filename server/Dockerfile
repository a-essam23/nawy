FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only package files first to leverage caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Copy source files and build
COPY . .
RUN pnpm build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install pnpm in production image
RUN npm install -g pnpm

# Copy only production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./


EXPOSE 3100
CMD ["node", "dist/main"]