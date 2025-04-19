FROM node:18-alpine

WORKDIR /app

# Install system dependencies for systeminformation
RUN apk add --no-cache python3 make g++ gcc

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
