# Use the official NGINX image as the base image
FROM nginx:latest

# Copy our custom HTML page to NGINX's default website directory
COPY index.html /usr/share/nginx/html/index.html

# Document that NGINX listens on container port 80
EXPOSE 80

# Start NGINX in the foreground so the container keeps running
CMD ["nginx", "-g", "daemon off;"]