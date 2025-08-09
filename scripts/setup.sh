#!/bin/bash

# URWRITER Development Setup Script

echo "🚀 Setting up URWRITER development environment..."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo "📦 Installing pnpm..."
        npm install -g pnpm
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "⚠️  Docker is not installed. You'll need to set up PostgreSQL, Redis, and Meilisearch manually."
        echo "   Or install Docker to use the provided docker-compose setup."
    fi
    
    echo "✅ Prerequisites check complete"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    pnpm install
    echo "✅ Dependencies installed"
}

# Setup environment
setup_environment() {
    echo "🔧 Setting up environment..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "📝 Created .env file from .env.example"
        echo "⚠️  Please edit .env with your actual values before starting the application"
    else
        echo "✅ .env file already exists"
    fi
}

# Start infrastructure with Docker
start_infrastructure() {
    if command -v docker &> /dev/null; then
        echo "🐳 Starting infrastructure with Docker..."
        cd infra/docker
        docker-compose -f compose.dev.yml up -d postgres redis meilisearch minio
        cd ../..
        echo "✅ Infrastructure started"
        echo "   - PostgreSQL: localhost:5432"
        echo "   - Redis: localhost:6379"
        echo "   - Meilisearch: localhost:7700"
        echo "   - MinIO: localhost:9000"
    else
        echo "⚠️  Docker not available. Please start your databases manually:"
        echo "   - PostgreSQL on port 5432"
        echo "   - Redis on port 6379"
        echo "   - Meilisearch on port 7700"
    fi
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    cd apps/backend
    
    echo "Generating Prisma client..."
    pnpm run db:generate
    
    echo "Running database migrations..."
    pnpm run db:migrate
    
    cd ../..
    echo "✅ Database setup complete"
}

# Build packages
build_packages() {
    echo "🔨 Building shared packages..."
    pnpm run build --filter=@urwriter/config
    pnpm run build --filter=@urwriter/shared-types
    pnpm run build --filter=@urwriter/ui
    echo "✅ Packages built"
}

# Main setup flow
main() {
    check_prerequisites
    install_dependencies
    setup_environment
    start_infrastructure
    
    echo "⏳ Waiting for databases to be ready..."
    sleep 10
    
    setup_database
    build_packages
    
    echo ""
    echo "🎉 Setup complete! You can now start development:"
    echo ""
    echo "  # Start all applications:"
    echo "  pnpm run dev"
    echo ""
    echo "  # Or start individually:"
    echo "  pnpm run dev:backend   # API server on :3001"
    echo "  pnpm run dev:frontend  # Web app on :3000"
    echo ""
    echo "📚 API Documentation: http://localhost:3001/api/docs"
    echo "🌐 Web Application: http://localhost:3000"
    echo ""
    echo "⚠️  Don't forget to update your .env file with real values!"
}

main
