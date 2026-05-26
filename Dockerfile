# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# We will inject the custom nginx.conf later via docker-compose volume
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
