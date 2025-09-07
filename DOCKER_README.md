# Docker Deployment Guide for Teryaq Pharmacy Management System

This guide explains how to deploy the Teryaq Pharmacy Management System frontend using Docker and Docker Compose, integrating with your existing backend infrastructure.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Existing backend containers running (teryaq-backend, teryaq-db)
- At least 1GB RAM available for frontend
- At least 2GB disk space

## Architecture

This setup integrates with your existing backend infrastructure:

- **teryaq-frontend**: Next.js frontend application (port 3000)
- **teryaq-backend**: Your existing Spring Boot backend (port 13000)
- **teryaq-db**: Your existing PostgreSQL database (port 15432)
- **teryaq-net**: Shared Docker network

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repository-url>
cd teryaq-pharmacy-owner
```

### 2. Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp env.example .env.production
```

Edit `.env.production` with your actual values:

```bash
# Database Configuration
POSTGRES_DB=teryaq_pharmacy
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://postgres:your_secure_password_here@postgres:5432/teryaq_pharmacy

# Redis Configuration
REDIS_URL=redis://redis:6379

# Next.js Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Add other required environment variables...
```

### 3. Production Deployment

**Make sure your backend containers are running first:**

```bash
# Start your existing backend (if not already running)
cd /path/to/your/backend
docker-compose up -d

# Then start the frontend
cd /path/to/your/frontend
docker-compose up --build -d

# View logs
docker-compose logs -f teryaq-frontend

# Check service status
docker-compose ps
```

### 4. Development Setup

For development with hot reload:

```bash
# Copy development environment
cp env.example .env.local

# Make sure your backend is running
cd /path/to/your/backend
docker-compose up -d

# Start frontend development
cd /path/to/your/frontend
docker-compose -f docker-compose.dev.yml up -d

# View development logs
docker-compose -f docker-compose.dev.yml logs -f teryaq-frontend-dev
```

## Services

### Frontend Services

- **teryaq-frontend**: Next.js frontend application (port 3000)
- **teryaq-frontend-dev**: Development server with hot reload

### Backend Services (Existing)

- **teryaq-backend**: Spring Boot backend API (port 13000)
- **teryaq-db**: PostgreSQL database (port 15432)
- **teryaq-net**: Shared Docker network

## Configuration

### Database

The PostgreSQL database is configured with:
- Persistent data storage
- Custom initialization script (`init.sql`)
- Custom types and extensions

### Redis

Redis is configured for:
- Session storage
- Caching
- Rate limiting

### Nginx

Nginx provides:
- Reverse proxy
- SSL termination
- Rate limiting
- Security headers
- Gzip compression
- Static file caching

## SSL Configuration

To enable HTTPS:

1. Place your SSL certificates in the `ssl/` directory:
   ```
   ssl/
   ├── cert.pem
   └── key.pem
   ```

2. Uncomment the HTTPS server block in `nginx.conf`

3. Update `NEXTAUTH_URL` in your environment file to use `https://`

## Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Development
docker-compose -f docker-compose.dev.yml logs -f app-dev
```

### Health Checks

```bash
# Check if services are running
docker-compose ps

# Check resource usage
docker stats

# Check database connection
docker-compose exec postgres psql -U postgres -d teryaq_pharmacy -c "SELECT version();"
```

## Backup and Restore

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres teryaq_pharmacy > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres teryaq_pharmacy < backup.sql
```

### Volume Backup

```bash
# Backup volumes
docker run --rm -v teryaq-pharmacy-owner_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
docker run --rm -v teryaq-pharmacy-owner_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz -C /data .
```

## Scaling

### Horizontal Scaling

To scale the application:

```bash
# Scale app service
docker-compose up -d --scale app=3

# Update nginx upstream configuration for load balancing
```

### Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## Troubleshooting

### Common Issues

1. **Standalone output error**: If you get "standalone not found" error:
   - The Dockerfile has been updated to work without standalone output
   - Make sure `output: 'standalone'` is set in `next.config.ts`
   - Use the simplified Dockerfile that copies the full `.next` directory

2. **Port conflicts**: Change ports in docker-compose.yml if 3000, 5432, or 6379 are in use
3. **Permission issues**: Ensure Docker has proper permissions
4. **Memory issues**: Increase Docker memory allocation
5. **Database connection**: Check DATABASE_URL format and credentials

### Debug Commands

```bash
# Enter container shell
docker-compose exec app sh
docker-compose exec postgres psql -U postgres

# Check container logs
docker-compose logs app
docker-compose logs postgres

# Restart specific service
docker-compose restart app

# Rebuild and restart
docker-compose up -d --build app
```

## Security Considerations

1. **Change default passwords** in production
2. **Use strong secrets** for JWT and encryption
3. **Enable SSL/TLS** for production
4. **Regular updates** of base images
5. **Network isolation** using Docker networks
6. **Resource limits** to prevent resource exhaustion

## Performance Optimization

1. **Enable gzip compression** in Nginx
2. **Use Redis caching** for frequently accessed data
3. **Optimize database queries** and add indexes
4. **Use CDN** for static assets
5. **Monitor resource usage** and scale accordingly

## Maintenance

### Regular Tasks

1. **Update dependencies**: Rebuild images regularly
2. **Database maintenance**: Run VACUUM and ANALYZE
3. **Log rotation**: Configure log rotation
4. **Backup verification**: Test backup restoration
5. **Security updates**: Keep base images updated

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or rolling update
docker-compose up -d --no-deps app
```

## Support

For issues and questions:
1. Check the logs first
2. Verify environment configuration
3. Check Docker and Docker Compose versions
4. Review this documentation
5. Contact the development team
