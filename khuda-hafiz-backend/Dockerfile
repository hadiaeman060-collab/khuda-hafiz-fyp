# Use official Node.js 18 image (lightweight Alpine version)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (so npm install is cached if code didn't change)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
