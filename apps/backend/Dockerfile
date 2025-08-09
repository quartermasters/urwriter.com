# Dockerfile for Backend (NestJS)
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml turbo.json ./
COPY packages ./packages

# Copy backend app
COPY apps/backend ./apps/backend

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd apps/backend && pnpm run db:generate

# Build backend
RUN pnpm run build --filter=@urwriter/backend

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy built backend
COPY --from=base /app/apps/backend/dist ./dist
COPY --from=base /app/apps/backend/package.json ./
COPY --from=base /app/apps/backend/prisma ./prisma
COPY --from=base /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/main.js"]
