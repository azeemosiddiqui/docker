
# 1. Use the Node.js base image
FROM node:22-slim

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json into the image
COPY package.json .

# 4. Install application dependencies
RUN npm install

# 5. Copy application code
COPY app.js .

# 6. Document the application port
EXPOSE 3000

# 7. Start the application
CMD ["npm", "start"]





# FROM
# Node.js runtime wali base image select karta hai.

# WORKDIR
# Container ke andar /app working directory set karta hai.

# COPY package.json .
# Dependency file image mein copy karta hai.

# RUN npm install
# Image build karte waqt dependencies install karta hai.

# COPY app.js .
# Application code copy karta hai.

# EXPOSE 3000
# Intended container port document karta hai.

# CMD
# Container start hone par npm start chalata hai.