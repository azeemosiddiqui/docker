# 1) FROM: Start with an official image that already has Node.js installed.
FROM node:22-alpine

# 2) WORKDIR: Set the working directory inside the image/container.
# Relative paths such as "app.js" are now based on /app.
WORKDIR /app

# 3) COPY: Copy app.js from your computer's build folder into /app.
COPY app.js ./app.js

# 4) COPY: Copy the startup script into the image.
COPY entrypoint.sh ./entrypoint.sh

# 5) ADD: A local .tar.gz archive is automatically extracted into /app/assets/.
# This is a teaching example; for normal files/folders, COPY is usually preferred.
ADD public-assets.tar.gz /app/assets/

# 6) ENV: Set an environment variable available to the Node.js process.
# The app reads it with process.env.PORT.
ENV PORT=3000

# 7) EXPOSE: Document the port the app listens on inside the container.
# This does NOT publish the port to your computer; use -p with docker run.
EXPOSE 3000

# 8) RUN: Execute this command while building the image.
# Make the startup script executable inside Linux.
RUN chmod +x /app/entrypoint.sh

# 9) ENTRYPOINT: Choose the startup script that runs when the container starts.
ENTRYPOINT ["/app/entrypoint.sh"]

# 10) CMD: Set the default command/arguments passed to ENTRYPOINT.
# Together they run: /app/entrypoint.sh node app.js
CMD ["node", "app.js"]
