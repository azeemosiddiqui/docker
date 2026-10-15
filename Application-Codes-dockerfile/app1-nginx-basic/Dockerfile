# Use nginx:latest as the base image
FROM nginx:latest

# mkdir app-nginx && cd /app-nginx
WORKDIR /app-nginx

# Copy everything from local current directory into "/app-nginx" directory
COPY . .

# Document that the application uses port 80
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]