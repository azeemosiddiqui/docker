
# Use Ubuntu as the base image
FROM ubuntu:24.04

# Update the package information
# Install Nginx
# Clean the downloaded package cache
# Remove package list files to reduce image size
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Run Nginx in the foreground
# Keep the container running while Nginx is running
CMD ["nginx", "-g", "daemon off;"]
