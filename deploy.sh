#!/bin/bash

# Teryaq Pharmacy Frontend Deployment Script
# This script helps deploy the frontend with your existing backend

echo "🚀 Teryaq Pharmacy Frontend Deployment"
echo "====================================="

# Check if backend containers are running
echo "📋 Checking backend containers..."
if ! docker ps --format "table {{.Names}}" | grep -q "teryaq-backend"; then
    echo "❌ Backend container 'teryaq-backend' is not running!"
    echo "Please start your backend first:"
    echo "  cd /path/to/your/backend"
    echo "  docker-compose up -d"
    exit 1
fi

if ! docker ps --format "table {{.Names}}" | grep -q "teryaq-db"; then
    echo "❌ Database container 'teryaq-db' is not running!"
    echo "Please start your backend first:"
    echo "  cd /path/to/your/backend"
    echo "  docker-compose up -d"
    exit 1
fi

echo "✅ Backend containers are running"

# Check if environment file exists
if [ ! -f ".env.production" ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.production
    echo "⚠️  Please edit .env.production with your actual values"
    echo "   Key variables to update:"
    echo "   - NEXTAUTH_SECRET"
    echo "   - Any other API keys or secrets"
    read -p "Press Enter after updating .env.production..."
fi

# Deploy frontend
echo "🔨 Building and deploying frontend..."
docker-compose up --build -d

# Check deployment status
echo "📊 Checking deployment status..."
sleep 5
docker-compose ps

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Frontend is available at: http://localhost:3000"
echo "Backend API is available at: http://localhost:13000"
echo ""
echo "To view logs: docker-compose logs -f teryaq-frontend"
echo "To stop: docker-compose down"
