# Stage 1: Build React App (uses node to compile the project)
FROM node:20-alpine AS builder

WORKDIR /app/build-target

# Copy dependency files
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx (uses a very light web server)
FROM nginx:alpine

# Copy the built assets (from the 'dist' folder) to the Nginx public directory
COPY --from=builder /app/build-target/dist /usr/share/nginx/html

# Default HTTP port for Nginx
EXPOSE 80

# The default command starts Nginx
CMD ["nginx", "-g", "daemon off;"]