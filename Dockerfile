# Use official Node.js 18 image (lightweight Alpine version)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy backend package files first so npm install can be cached
COPY khuda-hafiz-backend/package*.json ./

# Install production dependencies
RUN npm install --production

# Copy backend source code only
COPY khuda-hafiz-backend/ ./

# Expose the port your app runs on
EXPOSE 3000

# Start the backend server
CMD ["node", "index.js"]
