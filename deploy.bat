@echo off
REM Teryaq Pharmacy Frontend Deployment Script for Windows
REM This script helps deploy the frontend with your existing backend

echo 🚀 Teryaq Pharmacy Frontend Deployment
echo =====================================

REM Check if backend containers are running
echo 📋 Checking backend containers...
docker ps | findstr "teryaq-backend" >nul
if %errorlevel% neq 0 (
    echo ❌ Backend container 'teryaq-backend' is not running!
    echo Please start your backend first:
    echo   cd /path/to/your/backend
    echo   docker-compose up -d
    pause
    exit /b 1
)

docker ps | findstr "teryaq-db" >nul
if %errorlevel% neq 0 (
    echo ❌ Database container 'teryaq-db' is not running!
    echo Please start your backend first:
    echo   cd /path/to/your/backend
    echo   docker-compose up -d
    pause
    exit /b 1
)

echo ✅ Backend containers are running

REM Check if environment file exists
if not exist ".env.production" (
    echo 📝 Creating environment file...
    copy env.example .env.production
    echo ⚠️  Please edit .env.production with your actual values
    echo    Key variables to update:
    echo    - NEXTAUTH_SECRET
    echo    - Any other API keys or secrets
    pause
)

REM Deploy frontend
echo 🔨 Building and deploying frontend...
docker-compose up --build -d

REM Check deployment status
echo 📊 Checking deployment status...
timeout /t 5 /nobreak >nul
docker-compose ps

echo.
echo 🎉 Deployment complete!
echo.
echo Frontend is available at: http://localhost:3000
echo Backend API is available at: http://localhost:13000
echo.
echo To view logs: docker-compose logs -f teryaq-frontend
echo To stop: docker-compose down
pause
