# Dockerfile for Frontend (Next.js)
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml turbo.json ./
COPY packages ./packages

# Copy frontend app
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
RUN pnpm run build --filter=@urwriter/frontend

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy built frontend
COPY --from=base /app/apps/frontend/.next/standalone ./
COPY --from=base /app/apps/frontend/.next/static ./.next/static
COPY --from=base /app/apps/frontend/public ./public

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
