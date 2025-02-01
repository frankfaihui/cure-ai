FROM node:20-alpine

# Create an app directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for faster caching)
COPY package*.json ./

# Install node modules
RUN npm install --production

# Copy the rest of the application code
COPY . .

# The app listens on port 4000
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
