# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install http-server globally
RUN npm install -g http-server

# Copy the rest of the application code
COPY ./src ./

# Expose the port
EXPOSE 3001

# Run the application
CMD ["http-server", "./", "-p", "3001"]




