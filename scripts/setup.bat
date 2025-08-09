@echo off

echo 🚀 Setting up URWRITER development environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm...
    npm install -g pnpm
)

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Setup environment
if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file from .env.example
    echo ⚠️  Please edit .env with your actual values before starting the application
) else (
    echo ✅ .env file already exists
)

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🐳 Starting infrastructure with Docker...
    cd infra\docker
    docker-compose -f compose.dev.yml up -d postgres redis meilisearch minio
    cd ..\..
    echo ✅ Infrastructure started
    echo    - PostgreSQL: localhost:5432
    echo    - Redis: localhost:6379
    echo    - Meilisearch: localhost:7700
    echo    - MinIO: localhost:9000
    
    echo ⏳ Waiting for databases to be ready...
    timeout /t 10 /nobreak > nul
) else (
    echo ⚠️  Docker not available. Please start your databases manually:
    echo    - PostgreSQL on port 5432
    echo    - Redis on port 6379
    echo    - Meilisearch on port 7700
)

REM Setup database
echo 🗄️  Setting up database...
cd apps\backend
echo Generating Prisma client...
pnpm run db:generate
echo Running database migrations...
pnpm run db:migrate
cd ..\..

REM Build packages
echo 🔨 Building shared packages...
pnpm run build --filter=@urwriter/config
pnpm run build --filter=@urwriter/shared-types
pnpm run build --filter=@urwriter/ui

echo.
echo 🎉 Setup complete! You can now start development:
echo.
echo   # Start all applications:
echo   pnpm run dev
echo.
echo   # Or start individually:
echo   pnpm run dev:backend   # API server on :3001
echo   pnpm run dev:frontend  # Web app on :3000
echo.
echo 📚 API Documentation: http://localhost:3001/api/docs
echo 🌐 Web Application: http://localhost:3000
echo.
echo ⚠️  Don't forget to update your .env file with real values!
