# WHY: Use an official Node.js runtime image.
FROM node:22-bookworm-slim

# WHY: Keep app files in one predictable directory.
WORKDIR /app

# WHY: Copy package metadata first to improve Docker layer caching.
COPY package.json ./

# WHY: Install runtime dependencies; nodemon is dev-only and excluded.
RUN npm install --omit=dev && npm cache clean --force

# WHY: ADD automatically extracts a local .tar.gz archive into /app/public.
ADD public-assets.tar.gz /app/public/

# WHY: Copy the application source and browser assets.
COPY app.js ./app.js
COPY views ./views
COPY public ./public
COPY entrypoint.sh ./entrypoint.sh

# WHY: Make the entrypoint script executable inside Linux.
RUN chmod +x /app/entrypoint.sh

# WHY: Document the app's internal port; this does not publish it.
EXPOSE 3000

# WHY: ENTRYPOINT is the startup wrapper that runs before CMD.
ENTRYPOINT ["/app/entrypoint.sh"]

# WHY: CMD provides default command and arguments to the ENTRYPOINT.
CMD ["node", "app.js"]
