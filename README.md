# URWRITER - Writer-First Freelance Marketplace

A comprehensive freelance marketplace built with Next.js, NestJS, Prisma, and PostgreSQL, featuring editorial collaboration, brand governance, escrow protection, and compliance-grade data labeling.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TailwindCSS, shadcn/ui, React Query, Zustand
- **Backend**: NestJS 10, TypeScript, Prisma 5, PostgreSQL 15
- **Cache/Queue**: Redis 7, BullMQ
- **Search**: Meilisearch 1.7
- **Storage**: S3-compatible (AWS S3/MinIO)
- **Payments**: Stripe Connect, Stripe Identity
- **Auth**: JWT (access + refresh), Argon2id, optional 2FA

### Monorepo Structure
```
/urwriter
  /apps
    /frontend  (Next.js client app)
    /backend   (NestJS API server)
  /packages
    /shared-types  (TypeScript types, Zod schemas)
    /ui           (Design system components)
    /config       (Shared configuration)
  .env.example
  package.json
  turbo.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- pnpm 8+

### Installation

1. **Clone and setup**
   ```bash
   cd urwriter
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Database setup**
   ```bash
   # Start PostgreSQL and Redis
   pnpm run db:generate
   pnpm run db:migrate
   ```

4. **Development**
   ```bash
   # Start all apps in development mode
   pnpm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

## 📊 Core Features

### Phase 1 (Weeks 1-2) ✅
- [x] Monorepo setup with Turborepo + pnpm
- [x] Auth module (JWT + 2FA stubs)
- [x] Prisma schema for Users, Profiles, Orgs, BrandGuides
- [x] Basic admin access gating

### Phase 2 (Weeks 3-5)
- [ ] Jobs module with Brief Generator and completeness scoring
- [ ] Proposals module with Boost and listing
- [ ] Messaging threads with contact masking
- [ ] Public pages and dashboards

### Phase 3 (Weeks 6-7)
- [ ] Contracts and Milestones with auto-suggest
- [ ] Escrow funding via Stripe Connect
- [ ] Collaborative editor with QA rails
- [ ] Delivery and Approvals

### Phase 4 (Week 8)
- [ ] Search & Match with ranking signals
- [ ] Job Quality Score nudges

### Phase 5 (Week 9)
- [ ] Admin KYC queue and Disputes
- [ ] Risk event logging
- [ ] Double-entry ledger

### Phase 6 (Weeks 10-12)
- [ ] Enterprise features (org roles, budgets, PO)
- [ ] Labeling vertical (projects, tasks, rubrics, IAA)
- [ ] Performance optimization and compliance
- [ ] Pilot readiness

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

### Users & Profiles
- `GET /api/v1/me` - Get current user
- `PUT /api/v1/me` - Update current user

### Organizations
- `POST /api/v1/orgs` - Create organization
- `POST /api/v1/orgs/:id/brand-guides` - Create brand guide

### Jobs & Proposals
- `POST /api/v1/jobs` - Create job
- `GET /api/v1/jobs` - List jobs
- `POST /api/v1/jobs/:id/proposals` - Submit proposal

### Contracts & Escrow
- `POST /api/v1/contracts` - Create contract
- `POST /api/v1/escrow/:milestone_id/fund` - Fund milestone
- `POST /api/v1/escrow/:milestone_id/release` - Release escrow

## 🛡️ Security & Compliance

- **Authentication**: Argon2id password hashing, JWT tokens
- **Authorization**: Role-based access control
- **KYC**: Stripe Identity integration
- **PCI Compliance**: Stripe Elements (no card data storage)
- **Data Protection**: GDPR/CCPA ready
- **Audit Logging**: All admin actions, payments, risk events

## 📈 Performance Targets

- Search p95: < 400ms
- Editor save p95: < 500ms
- Message send p95: < 300ms
- Availability: 99.5%

## 🏃‍♂️ Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm run dev              # Start all apps
pnpm run dev:frontend     # Frontend only
pnpm run dev:backend      # Backend only

# Database
pnpm run db:generate      # Generate Prisma client
pnpm run db:migrate       # Run migrations
pnpm run db:reset         # Reset database
pnpm run db:studio        # Open Prisma Studio

# Building
pnpm run build            # Build all apps
pnpm run lint             # Lint all apps
pnpm run typecheck        # Type check all apps
pnpm run test             # Run tests
```

## 🌍 Deployment

The application is containerized and ready for deployment on:
- AWS (ECS, Elastic Beanstalk)
- Render
- Fly.io
- Docker Compose

See deployment guides in `/docs` for platform-specific instructions.

## 📝 Contributing

1. Follow the established patterns in each module
2. Add tests for new features
3. Update documentation
4. Ensure type safety with TypeScript strict mode
5. Follow the API contract specifications

## 📄 License

Proprietary - URWRITER by Sumera Khan / Quartermasters FZC

---

**Built with ❤️ for writers, by writers.**
