# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copie o conteúdo da pasta src para o diretório de trabalho
COPY src/ ./

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
