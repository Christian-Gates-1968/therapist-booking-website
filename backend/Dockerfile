# Stage 1: Build (Installs dependencies)
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app/backend

# Copy necessary files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other application code
COPY . .

# Stage 2: Production (Final minimal image)
FROM node:20-alpine

# Set the working directory
WORKDIR /app/backend

# Copy over only the installed dependencies and application code from the builder stage
COPY --from=builder /app/backend .

# Expose the port the Node.js server is listening on
EXPOSE 4000

# Command to start the application (from package.json "start": "node server.js")
CMD ["npm", "start"]