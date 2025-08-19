# Deployment Guide

This document explains the Docker and Nginx configuration used in this project for both development and production environments.

## Table of Contents

1. [Docker Overview](#docker-overview)
2. [Dockerfile Explanation](#dockerfile-explanation)
3. [Docker Compose Setup](#docker-compose-setup)
4. [Nginx Configuration](#nginx-configuration)
5. [Deployment Instructions](#deployment-instructions)

## Docker Overview

Docker is used to containerize the application, providing consistent environments across different stages of development and production. Key benefits:

- **Consistency**: Same environment in development, testing, and production
- **Isolation**: Dependencies are contained within the container
- **Portability**: Runs the same way on any Docker-supported platform
- **Scalability**: Easy to scale services up or down

## Dockerfile Explanation

The `Dockerfile` is a multi-stage build file that handles both development and production environments:

```dockerfile
# Build stage
FROM oven/bun:latest as build
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build Stage

1. Uses `oven/bun:latest` as the base image
2. Copies `package.json` and `bun.lockb` first for better layer caching
3. Installs dependencies using Bun
4. Copies the rest of the application code
5. Builds the production assets

### Production Stage

1. Uses lightweight `nginx:stable-alpine` image
2. Copies built assets from the build stage
3. Applies Nginx configuration
4. Exposes port 80 for web traffic

## Docker Compose Setup

The `docker-compose.yml` file defines two main services:

### 1. Production Service (`app`)

- Builds the production-optimized image
- Maps host port 8080 to container port 80
- Includes health checks
- Runs in production mode

### 2. Development Service (`dev`)

- Enables hot-reloading for development
- Maps host port 5173 to container port 5173
- Mounts the local directory for live updates
- Preserves `node_modules` in a volume

## Nginx Configuration

The `nginx.conf` file configures the web server with these key features:

### 1. SPA Routing

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Ensures client-side routing works by serving `index.html` for all routes.

### 2. Static Asset Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

Caches static assets for optimal performance.

### 3. Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

Enhances security with various HTTP headers.

### 4. Gzip Compression

```nginx
gzip on;
gzip_vary on;
gzip_min_length 10240;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
```

Reduces file sizes for faster loading.

## Deployment Instructions

### Prerequisites

- Docker
- Docker Compose

### Development Mode

1. Start the development server:
   ```bash
   docker compose up dev
   ```
2. Access the app at: http://localhost:5173

### Production Build

1. Build and start the production containers:
   ```bash
   docker compose up -d --build
   ```
2. Access the app at: http://localhost:8080

### Useful Commands

- View logs: `docker compose logs -f`
- Stop containers: `docker compose down`
- Rebuild images: `docker compose build --no-cache`
- Clean up: `docker system prune -f`

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080 and 5173 are available
2. **Permission issues**: Run Docker commands with appropriate permissions
3. **Build failures**: Check for syntax errors in Dockerfile and dependencies
4. **Nginx configuration**: Verify nginx.conf for any syntax errors

### Checking Logs

```bash
docker compose logs -f [service_name]
```

### Accessing Containers

```bash
docker exec -it vue-app sh  # For production container
docker exec -it vue-app-dev sh  # For development container
```

## Security Considerations

1. Keep Docker and dependencies updated
2. Use `.dockerignore` to exclude sensitive files
3. Implement proper secrets management for production
4. Consider using Docker secrets or environment variables for sensitive data

## Performance Optimization

1. **Multi-stage builds**: Reduces final image size
2. **Layer caching**: Optimizes build times
3. **Asset compression**: Enabled via Nginx
4. **Caching headers**: Proper cache control for static assets

For more detailed information, refer to the official Docker and Nginx documentation.
