## Project 5: Nexus Taskboard (Advanced Node.js + Docker)

### What is this project?

**Nexus Taskboard** is a task-management dashboard. It has a styled board UI (To do, In progress, Done), a REST API, several npm dependencies, and a Dockerfile that uses **RUN, CMD, ADD and ENTRYPOINT** together.

| Part | What it does |
|---|---|
| **Frontend** | Task board, progress bar, priority filters, search, "New task" dialog, light and dark theme |
| **Backend** | Express server with REST APIs for tasks, stats and health |
| **Dependencies** | See the table below |
| **Docker** | Multi-instruction Dockerfile with an entrypoint script and an archive extracted by `ADD` |

### Folder structure

```text
app5-nodejs-advanced/
├── Dockerfile
├── entrypoint.sh            <- ENTRYPOINT script
├── package.json
├── app.js                   <- Express server
├── public-assets.tar.gz     <- extracted by ADD (logo and favicon)
├── .dockerignore
├── .env.example
├── README.md
├── views/
│   └── index.html
└── public/
    ├── css/styles.css
    └── js/app.js            <- browser code
```

### npm dependencies (package.json)

| Package | Type | Why we use it |
|---|---|---|
| `express` | dependency | The web framework: routes and API. |
| `helmet` | dependency | Adds secure HTTP headers. |
| `morgan` | dependency | Prints one log line per request (see them with `docker logs`). |
| `compression` | dependency | Compresses responses (gzip) so pages load faster. |
| `express-rate-limit` | dependency | Limits requests per minute to protect the API. |
| `dotenv` | dependency | Reads a `.env` file for local development. |
| `dayjs` | dependency | Small date library. Gives "3 days ago" text. |
| `nodemon` | **devDependency** | Restarts the server when code changes (local development only). |

`dependencies` are needed to **run** the app. `devDependencies` are only for developers. In the image we install only `dependencies` using `npm install --omit=dev`, so `nodemon` is not included and the image stays smaller.

### How to run

```bash
# 1. Build the image
docker build -t app5-nodejs-advanced:v1 .

# 2. Start a container (host port 8085 -> container port 3000)
docker run -d --name app5-nodejs-advanced -p 8085:3000 app5-nodejs-advanced:v1

# 3. Check it
docker ps
docker logs app5-nodejs-advanced
```

Open **http://localhost:8085**. Node.js is not needed on your computer, because the image installs everything.

---

## The Complete Dockerfile

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY app.js .
COPY views/ views/
COPY public/ public/
ADD public-assets.tar.gz /app/public/
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh
ENV NODE_ENV=production \
    PORT=3000
USER node
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "app.js"]
```

(The real file in the ZIP has a comment above every instruction.)

---

## Instruction-by-Instruction Explanation

### 1. `FROM node:22-slim` - Base image

| | |
|---|---|
| **What** | Chooses the starting image: Linux with Node.js 22 already installed. |
| **Why** | We do not want to install Node.js ourselves. `slim` is smaller and has fewer security risks. |
| **When** | Always the first instruction. |
| **How** | `FROM <image>:<tag>` |

### 2. `WORKDIR /app` - Working folder

| | |
|---|---|
| **What** | Sets `/app` as the folder where next commands run. Like `cd /app`. |
| **Why** | Keeps our project files in one clean place. |
| **When** | Before `COPY`, `RUN`, `ADD` and `CMD`. |
| **How** | `WORKDIR <path>` (Docker creates it if missing). |

### 3. `COPY package.json .` - Dependency list first

| | |
|---|---|
| **What** | Copies only `package.json` into `/app`. |
| **Why** | Layer caching. If we change only code, Docker reuses the slow `npm install` layer. |
| **When** | Before `npm install`. |
| **How** | `COPY <source> <destination>` |

### 4. `RUN npm install --omit=dev` - Install packages

| | |
|---|---|
| **What** | Runs npm while the image is built. Creates `node_modules` inside the image. |
| **Why** | The app needs Express, Helmet and the others to start. `--omit=dev` skips `nodemon`. |
| **When** | **Build time** (`docker build`). |
| **How** | `RUN <command>` |

### 5. `COPY app.js .`, `COPY views/ views/`, `COPY public/ public/` - Application code

| | |
|---|---|
| **What** | Copies the server, the HTML page, and the CSS and browser JavaScript into the image. |
| **Why** | The container needs our code to run. |
| **When** | **After** `npm install`, because code changes often. |
| **How** | `COPY <folder>/ <folder>/` copies a whole folder. |

### 6. `ADD public-assets.tar.gz /app/public/` - Copy and extract

| | |
|---|---|
| **What** | Copies the archive into the image **and unpacks it**. It creates `/app/public/assets/logo.svg` and `favicon.svg`. |
| **Why** | Shows the one real use case of `ADD`: auto-extracting a local tar archive. The page loads `/assets/logo.svg`, which exists only because of this step. |
| **When** | **Build time**. |
| **How** | `ADD <local-archive.tar.gz> <destination-folder/>` |

> **Remember:** For normal files, use `COPY`. Use `ADD` only when you need extraction. `ADD` can also download a URL, but `RUN curl` is better for that.

### 7. `COPY entrypoint.sh ...` and `RUN sed ... && chmod +x ...` - Prepare the startup script

| | |
|---|---|
| **What** | Copies the script to `/usr/local/bin/`. Then `sed` removes Windows line endings (`\r`) and `chmod +x` makes it executable. |
| **Why** | Files edited on Windows often have `CRLF` line endings, which cause `exec format error` or `no such file or directory` in Linux. A script also needs the execute permission to run. |
| **When** | **Build time**. |
| **How** | `RUN <cmd1> && <cmd2>` runs both in one layer. |

### 8. `ENV NODE_ENV=production PORT=3000` - Default settings

| | |
|---|---|
| **What** | Sets environment variables inside the image. |
| **Why** | `NODE_ENV=production` makes Express faster and logging more detailed. `PORT` tells the app which port to use. |
| **When** | Set at build time, **available at run time**. You can override it: `docker run -e PORT=4000 ...` |
| **How** | `ENV KEY=value` |

### 9. `USER node` - Do not run as root

| | |
|---|---|
| **What** | All later instructions and the running container use the `node` user, not `root`. |
| **Why** | Security. If someone attacks the app, they do not get root rights inside the container. The `node` user already exists in the official image. |
| **When** | After all the steps that need root (installing, `chmod`). |
| **How** | `USER <name>` |

### 10. `EXPOSE 3000` - Document the port

| | |
|---|---|
| **What** | Says that the app listens on port 3000. |
| **Why** | Documentation for the next engineer. |
| **When** | Any time before `CMD`. |
| **How** | `EXPOSE <port>`. It does **not** publish the port. Use `-p 8085:3000` for that. |

### 11. `ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]` - Fixed startup program

| | |
|---|---|
| **What** | The script that **always runs first** when the container starts. |
| **Why** | A wrapper can print startup info, check settings, and prepare things before the app starts. |
| **When** | **Run time** (`docker run`). |
| **How** | `ENTRYPOINT ["program", "arg"]` in exec form (square brackets). |

What our script does:

```sh
echo "[entrypoint] Starting ..."        # prints startup info (visible in docker logs)
echo "[entrypoint] NODE_ENV=... PORT=..."
# checks that ADD extracted the assets
exec "$@"                               # replaces the script with the CMD command
```

The last line, **`exec "$@"`**, is the most important. `"$@"` means "all arguments", which is the **CMD** (`node app.js`). `exec` replaces the script process with Node.js, so Node becomes the main process and receives the stop signal from `docker stop`. Our `app.js` handles `SIGTERM` and shuts down cleanly.

### 12. `CMD ["node", "app.js"]` - Default command

| | |
|---|---|
| **What** | The default command that is passed to ENTRYPOINT as arguments. |
| **Why** | Starts the Express server. Easy to replace when debugging. |
| **When** | **Run time**. |
| **How** | `CMD ["executable", "arg"]` |

---

## How ENTRYPOINT and CMD Work Together Here

```text
ENTRYPOINT  = /usr/local/bin/entrypoint.sh     (the program)
CMD         = node app.js                       (its default arguments)

Final command at start:   /usr/local/bin/entrypoint.sh node app.js
```

| You run | What happens |
|---|---|
| `docker run app5-nodejs-advanced:v1` | Script runs, then `node app.js` starts the server. |
| `docker run --rm app5-nodejs-advanced:v1 node -v` | Script runs, then **prints the Node version**. Your text **replaced CMD**. |
| `docker run -it --rm app5-nodejs-advanced:v1 sh` | Script runs, then opens a shell. |
| `docker run -it --rm --entrypoint sh app5-nodejs-advanced:v1` | The **script is skipped**. `--entrypoint` replaced ENTRYPOINT. |

---

## RUN vs CMD vs ENTRYPOINT vs ADD vs COPY

| | When it happens | Purpose | In this project |
|---|---|---|---|
| **RUN** | Build time | Run a command and save the result in the image | `npm install`, `chmod` |
| **CMD** | Run time | Default command (easy to replace) | `node app.js` |
| **ENTRYPOINT** | Run time | Fixed program that always runs first | `entrypoint.sh` |
| **ADD** | Build time | Copy files, **extract local tar archives**, download URLs | `public-assets.tar.gz` |
| **COPY** | Build time | Copy files only (clear and predictable) | Code, `package.json`, script |

Memory trick: **RUN** = prepare the image. **CMD** = changeable default. **ENTRYPOINT** = the door every start walks through. **ADD** = COPY plus extraction.

---

## Verify Everything (Practice Commands)

```bash
# 1. See the entrypoint messages
docker logs app5-nodejs-advanced

# 2. Prove ADD extracted the archive
docker exec app5-nodejs-advanced ls /app/public/assets

# 3. See ENTRYPOINT and CMD stored in the image
docker inspect --format='Entrypoint: {{.Config.Entrypoint}}  Cmd: {{.Config.Cmd}}' app5-nodejs-advanced:v1

# 4. Check you are not root
docker exec app5-nodejs-advanced whoami          # prints: node

# 5. Test the API
curl http://localhost:8085/api/health
curl http://localhost:8085/api/stats

# 6. Graceful stop (look for the SIGTERM message)
docker stop app5-nodejs-advanced
docker logs app5-nodejs-advanced

# 7. Clean up
docker rm app5-nodejs-advanced
```

---

## Common Problems

| Problem | Cause | Fix |
|---|---|---|
| `exec format error` or `no such file or directory` on start | `entrypoint.sh` has Windows `CRLF` line endings | Already handled by the `sed` step. Also set your editor to LF. |
| `port is already allocated` | Port 8085 is used by another container | Use another host port: `-p 8090:3000`. |
| Page loads without logo | `ADD` step was removed or archive missing | Check `docker exec <name> ls /app/public/assets`. |
| `Cannot find module 'express'` | `npm install` step missing | Keep `RUN npm install --omit=dev` before the code. |
| Browser cannot connect | Port not published, or app not listening on `0.0.0.0` | Use `-p 8085:3000`. Our `app.js` already listens on `0.0.0.0`. |
| Tasks disappear after restart | Data is stored in memory | Expected. A database or volume is the next improvement. |

### Ideas to improve this project (next steps)

- Create `package-lock.json` (run `npm install` once locally), copy `package*.json`, and use `npm ci --omit=dev` for repeatable builds.
- Add a `HEALTHCHECK` instruction that calls `/api/health`.
- Use a multi-stage build to keep the image smaller.
- Store tasks in a database container with Docker Compose.
- Push the image to Docker Hub with a version tag.

---

## Quick Reference (Hinglish)

| Instruction | Matlab |
|---|---|
| `FROM` | Node.js wali base image select karta hai. |
| `WORKDIR` | Container ke andar `/app` working folder set karta hai. |
| `COPY` | Files ko image mein copy karta hai (normal kaam ke liye best). |
| `RUN` | Build ke time command chalata hai (jaise `npm install`). Result image mein save hota hai. |
| `ADD` | `COPY` jaisa, par `.tar.gz` ko khud extract bhi kar deta hai. |
| `ENV` | Image ke andar environment variables set karta hai. |
| `USER node` | App ko root ki jagah normal user se chalata hai (security). |
| `EXPOSE 3000` | Port document karta hai. Port open nahi karta, uske liye `-p` chahiye. |
| `ENTRYPOINT` | Container start par sabse pehle chalne wala fixed script. |
| `CMD` | Default command (`node app.js`). `docker run` mein badla ja sakta hai. |
| `exec "$@"` | Script ko hata kar CMD wali command ko main process bana deta hai. |

---

* **Interview Explanation:**
This project is a Node.js and Express task dashboard that I packaged with Docker. I start with `FROM node:22-slim` and set `WORKDIR /app`. I copy `package.json` first and run `npm install --omit=dev`, so only production dependencies like Express, Helmet and Morgan go into the image, and the slow install layer is cached when only my code changes. Then I copy the application code. I use `ADD` for the UI assets because they are shipped as a `tar.gz` archive, and `ADD` automatically extracts a local archive into the image, while for normal files I prefer `COPY` because it is clearer. I copy an `entrypoint.sh` script, remove Windows line endings with `sed`, and make it executable with `chmod`. `ENV` sets `NODE_ENV` and `PORT`, `USER node` makes the app run without root rights, and `EXPOSE 3000` documents the port, which I publish with `-p 8085:3000` at run time. For startup I use both `ENTRYPOINT` and `CMD`: `ENTRYPOINT` runs my script, which prints startup information and checks the assets, and the script ends with `exec "$@"`, which replaces itself with the `CMD`, `node app.js`. That means Node.js is the main process and receives `SIGTERM` from `docker stop`, so the app shuts down cleanly. `CMD` stays easy to override, for example `docker run image node -v`, but the entrypoint script still runs. To skip the script I must use `--entrypoint`. `RUN`, `COPY` and `ADD` happen at build time during `docker build`, while `ENTRYPOINT` and `CMD` are stored in the image and only execute at run time with `docker run`.

### Common Follow-Up Questions

**Q: Why did you use `ADD` and not `COPY` for the assets?**
The assets are a local `tar.gz` archive, and `ADD` extracts it automatically. For normal files I use `COPY`.

**Q: Why use both `ENTRYPOINT` and `CMD`?**
`ENTRYPOINT` is the fixed startup wrapper and `CMD` gives the default arguments. The final command is `entrypoint.sh node app.js`, and users can still replace the `CMD` part.

**Q: What does `exec "$@"` do in the script?**
`"$@"` is the CMD. `exec` replaces the shell with that command, so Node.js becomes the main process (PID 1) and receives stop signals.

**Q: How do you skip the entrypoint script?**
Use `docker run --entrypoint sh -it <image>`. Text after the image name only replaces `CMD`.

**Q: What is the difference between `RUN` and `CMD`?**
`RUN` executes during the build and saves its result in the image. `CMD` executes when the container starts.

**Q: Why `--omit=dev`?**
It skips devDependencies like `nodemon`, so the image is smaller and safer.

**Q: Why copy `package.json` before the code?**
For layer caching. Dependencies change rarely, so the `npm install` layer is reused when only the code changes.

**Q: Why `USER node`?**
It runs the app without root rights, which limits damage if the app is attacked.

**Q: Why the `sed` command for the script?**
Windows editors can save `CRLF` line endings, which break shell scripts in Linux. `sed` removes the `\r` characters.

**Q: Does `EXPOSE` open the port?**
No. It only documents it. Use `-p host:container` with `docker run`.

**Q: Are `ENTRYPOINT` and `CMD` executed during `docker build`?**
No. They are only stored in the image and run when the container starts.

**Q: Why does the app listen on `0.0.0.0`?**
`127.0.0.1` is reachable only inside the container. `0.0.0.0` accepts outside connections, so the `-p` port mapping works.
