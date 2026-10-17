# App 5 — Nexus Taskboard

A responsive Node.js + Express task dashboard with API routes, task creation, status updates, security headers, request logging, compression, rate limiting and date utilities.

## Run with Docker

```bash
docker build -t app5-nodejs-advanced:v1 .
docker run -d --name app5-nodejs-advanced -p 8085:3000 app5-nodejs-advanced:v1
docker ps
docker logs app5-nodejs-advanced
```

Open http://localhost:8085

Health endpoint: `http://localhost:8085/api/health`

## API routes

- `GET /api/tasks` — list tasks
- `GET /api/tasks?status=Todo` — filter tasks
- `POST /api/tasks` — create a task; JSON body: `{"title":"Learn Docker layers"}`
- `PATCH /api/tasks/1` — update status; JSON body: `{"status":"Done"}`
- `GET /api/health` — health and uptime information

## Docker concepts in this project

- **RUN** runs during image build. Here it installs dependencies and marks the startup script executable.
- **CMD** supplies the default command: `node app.js`.
- **ENTRYPOINT** selects `/app/entrypoint.sh` as the startup wrapper. It prints config and uses `exec "$@"` to run CMD's command. Runtime arguments after the image name replace CMD arguments.
- **ADD** copies `public-assets.tar.gz` and automatically extracts it into `/app/public`. Prefer `COPY` for normal file copying; use `ADD` when archive extraction is intentional.
- **EXPOSE 3000** documents the container port; `-p 8085:3000` publishes it on the host.

Try replacing CMD arguments while keeping ENTRYPOINT:
```bash
docker run --rm app5-nodejs-advanced:v1 node -e "console.log('Custom command from Docker run')"
```
That prints the message and exits instead of starting the server.

## Notes
Tasks live in memory and reset when the container is recreated. This is a learning project, not a production task manager. The optional Google Fonts import requires internet access; the styling itself is local.
