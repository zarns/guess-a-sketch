# Use the official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container
COPY . .

# Install the dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the app
CMD ["npm", "run", "dev"]
