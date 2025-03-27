# Use official Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Expose the port used by React
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]