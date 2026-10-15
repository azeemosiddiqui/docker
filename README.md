## DOCKER COMMANDS
## *Important Points and commands*
### 1. Build the image from dockerfile
```bash
     docker build -t <image_name>:<tag> .
     docker build -t nginx:latest .
     docker build -t <image_name> .  #If image tag is not given during image build command docker will automatically  give tag as "latest"
```

### 2. Tag the image
     docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]    #SOURCE_IMAGE—> existing image & TARGET_IMAGE—> new name or tag you want to assign.
     docker tag mynginx:latest mynginx:v1
     docker images
        REPOSITORY   TAG       IMAGE ID
        mynginx      latest    abc123
        mynginx      v1        abc123  
     docker tag abc123 mynginx:v2         #Tag the image using "image ID"
     docker tag mynginx:v1 acrazeem.azurecr.io/mynginx:v1    #Change the tag to an Azure Container Registry name.You can tag the same image for pushing to your Azure Container Registry (ACR):
     docker push acrazeem.azurecr.io/mynginx:v1   # It will push the image into Azure ACR after registry login.      
* **Note:** Notice that both tags have the same image ID. Docker hasn't created a second copy of the image contents; it has added another reference to the same image. 
*  **Interview answer:** “Docker tagging allows us to assign a new name or version tag to an existing image without rebuilding it. We use docker tag SOURCE_IMAGE TARGET_IMAGE.”


### 3. Run/Create the container from dockerfile
     docker run -d --name <container_name> <image_name>:<image_tag>  # -d --> container run in detach mode, terminal will not open
     docker run -d --name nginx-container nginx:latest
     docker run -d --name nginx-container nginx  #If image tag is not given during container creation docker will automatically use tag as "latest"
     docker create --name my-nginx nginx:latest # Create container without running it
     docker start <container_ID> or <container_name>
     docker stop <container_ID> or <container_name>
     docker restart <container_ID> or <container_name>


### 4. Docker port mapping
     docker run -d -p 8080:80 --name my-nginx nginx:latest    #Create container with port mapping
* **Note:** Docker cannot add a new -p port mapping to an already-created container. The usual solution is to recreate the container with the required port mapping.
```bash
     docker stop my-nginx             # Stop the running container
     docker rm my-nginx               # Remove the container
     docker run -d -p 8080:80 --name my-nginx nginx:latest    #Create container with port mapping

     docker exec -it CONTAINER bash
                       └── Container already exists and is running
     docker run -it IMAGE bash
                       └── Create and start a new container
```
* **Note:** *All Docker flags (-d, --name, -p) must come before the image name. Docker treated them as arguments for the container instead of Docker options. Everything after the "IMAGE NAME" is passed as arguments to the container’s CMD / ENTRYPOINT.*
```bash
  docker run --name mynginx -d -p 8081:80 mynginx-image:1  -->CORRECT
  docker run -d -p 8081:80 mynginx-image:1 --name mynginx  -->INCORRECT
```


## docker run -d -p 8080:80 --name my-nginx-container my-nginx:1.0   #Run container
_Command Explain
docker run  ---> Create+start container
-d          ---> Detached/background mode
-p 8080:80  ---> Host port 8080 → Container port 80
--name my-nginx-container   ---> Give container a name
my-nginx:1.0                ---> Image used to create container
EOF__

# DOCKER COMMANDS

> Docker command reference for DevOps practice and interview preparation.
> Replace example names, image tags, ports, IDs, and paths with your own values.

---

## 1. Docker Installation and Information
docker --version                                      # Shows the installed Docker CLI version.
docker version                                        # Shows client and engine/server versions.
docker info                                           # Displays engine configuration and status.
docker help                                           # Lists available commands.
docker run --help                                     # Displays command-specific options.

## 2. Docker Images
docker pull nginx:latest                              # Downloads an image from Docker Hub or another registry.
docker images                                         # Lists images stored locally.
docker image ls                                       # Lists images stored locally.
docker image inspect nginx:latest                     # Shows image configuration and metadata.
docker history nginx:latest                           # Shows image layers and build history.
docker tag nginx:latest my-nginx:1.0                  # Adds another name/tag to an existing image; it does not rebuild it.
docker image rm nginx:latest                          # Removes a local image if it is not in use.
docker rmi my-nginx:1.0                               # Removes a local image if it is not in use.
docker image prune                           # Remove dangling(a build layer that has no tag and is not associated with any container) images
docker image prune -a                                 # Remove all unused images (use carefully)

## 3. Build Docker Images
docker build -t my-nginx:1.0 .                         # Build an image from the Dockerfile in the current directory
docker build -t my-nginx:1.0 -f Dockerfile .           # Specify the Dockerfile and build context
docker build --no-cache -t my-nginx:1.0 .              # Build without cached layers
docker build --pull -t my-nginx:1.0 .                  # Check for a newer base image before building
docker image inspect my-nginx:1.0                      # Inspect the image

_Command Explain_
- `docker build`     ---> Builds an image using Dockerfile instructions.
- `-t my-nginx:1.0`  ---> Names the image `my-nginx` and assigns tag `1.0`.
- `-f Dockerfile`    ---> Specifies which Dockerfile to use.
- `.`                ---> Sets the current directory as the build context.
- `--no-cache`       ---> Does not reuse cached build layers.
- `--pull`           ---> Checks for an updated base image.
- `image inspect`    ---> Displays image details.
EOF

## 4. Run and Manage Containers
docker run nginx:latest                                # Run NGINX in the foreground
docker run -d nginx:latest                             # Run NGINX in the background
docker run -d --name my-nginx nginx:latest             # Run a container with a name
docker run -d -p 8080:80 --name my-nginx nginx:latest  # Map host port 8080 to container port 80
docker run -it ubuntu:24.04 bash                       # Open an interactive Ubuntu shell
docker run --rm hello-world                            # Remove the container automatically after it exits
docker run -d --restart unless-stopped nginx:latest    # Restart unless manually stopped
docker create --name my-nginx nginx:latest             # Create a container without starting it
docker start my-nginx                                  # Start a stopped container
docker stop my-nginx                                   # Gracefully stop a running container
docker restart my-nginx                                # Restart a container
docker kill my-nginx                                   # Force-stop a container
docker pause my-nginx                                  # Pause container processes
docker unpause my-nginx                                # Resume container processes

__Command Explain
- `docker run`                 ---> Creates and starts a container from an image.
- `-d`                         ---> Detached/background mode.
- `--name my-nginx`            ---> Assigns a container name.
- `-p 8080:80`                 ---> Maps host port `8080` to container port `80` (`HOST:CONTAINER`).
- `-it`                        ---> Combines interactive mode and terminal allocation.
- `--rm`                       ---> Removes the container after it exits.
- `--restart unless-stopped`   ---> Restarts after failure/engine restart unless manually stopped.
- `docker create`              ---> Creates a container without starting it.
- `start` / `stop` / `restart` ---> Starts, gracefully stops, or restarts a container.
- `kill`                       ---> Force-stops a container.
- `pause` / `unpause`          ---> Freezes or resumes container processes.
EOF_

## 5. List, Inspect, and Remove Containers
docker ps                                             # List running containers
docker ps -a                                          # List all containers, including stopped ones (ncludes stopped/exited containers.)
docker container ls                                   # List running containers
docker container ls -a                                # List all containers
docker inspect my-nginx                # Show container configuration and state (Shows detailed configuration, state, mounts, and networking)
docker inspect -f '{{.State.Status}}' my-nginx        # Show only the container state (Formats output to show the container state.)
docker stats                                          # Show live resource usage (Shows CPU, memory, network, and block I/O usage.)
docker top my-nginx                                   # Show processes running in the container
docker rm my-nginx                                    # Remove a stopped container
docker rm -f my-nginx                                 # Force-remove a container (Stops and removes a container forcefully.)
docker container prune                                # Remove all stopped containers

## 6. Logs and Troubleshooting
docker logs my-nginx                                  # Displays standard output and error from the container.
docker logs -f my-nginx                               # Follow logs continuously or Follows new log entries.
docker logs --tail 100 my-nginx                       # Show the last 100 log lines
docker logs --since 10m my-nginx                      # Show logs from the last 10 minutes
docker exec my-nginx nginx -t                         # Run a command in a running container
docker exec -it my-nginx bash                         # Open Bash inside a running container
docker exec -it my-nginx sh                           # Open sh if Bash is unavailable
docker cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf                 # Copy a file from container to host
docker cp ./index.html my-nginx:/usr/share/nginx/html/index.html      # Copy a host file into container
docker diff my-nginx    # Show filesystem changes in the container or Shows files added, changed, or deleted in the container's writable layer.
docker events                                         # Streams engine events; press `Ctrl+C` to stop.

_Command Explain_
- `exec` ---> Runs a command inside a running container.
- `-it` ---> Opens an interactive terminal.
- `bash` / `sh` ---> Starts a shell if it exists in the image.
EOF

## 7. Port Mapping
docker run -d --name web -p 8080:80 nginx:latest       # Publish host port 8080 to container port 80
docker port web                                        # Show published port mappings
docker inspect -f '{{json .NetworkSettings.Ports}}' web # Show port bindings as JSON

_Command Explain
- `-p 8080:80` ---> Maps `HOST_PORT:CONTAINER_PORT`.
- `docker port web` ---> Shows published port mappings.
- `inspect ... Ports` ---> Displays configured port bindings.
- Browser ---> Open `http://localhost:8080` on the computer running Docker.
EOF__

## 8. Volumes and Persistent Data
docker volume create app-data                           # Create a named volume
docker volume ls                                       # List volumes
docker volume inspect app-data                         # Show volume details
docker run -d --name web-data -v app-data:/usr/share/nginx/html nginx:latest # Mount a named volume
docker run -d --name web-bind -v "$PWD/html:/usr/share/nginx/html" nginx:latest # Bind-mount a host directory (shell syntax may vary)
docker volume rm app-data                              # Remove an unused volume
docker volume prune                                    # Remove unused volumes; data may be lost

_Command Explain_
- `volume create` ---> Creates a Docker-managed volume.
- `volume ls` ---> Lists volumes.
- `volume inspect` ---> Shows volume metadata.
- `-v app-data:/path` ---> Mounts named volume `app-data` at the container path.
- `-v HOST_PATH:CONTAINER_PATH` ---> Bind-mounts a host directory.
- `volume rm` ---> Removes a volume not currently in use.
- `volume prune` ---> Deletes unused volumes; check before running.
- Note ---> Windows PowerShell, Git Bash, and Linux use different host-path syntax.
EOF

## 9. Docker Networks
docker network ls                                      # List networks
docker network create app-network                      # Create a bridge network
docker network inspect app-network                     # Inspect a network
docker run -d --name web --network app-network nginx:latest # Run a container on a network
docker network connect app-network my-nginx            # Connect an existing container
docker network disconnect app-network my-nginx         # Disconnect a container
docker network rm app-network                          # Remove an unused network
docker network prune                                   # Remove unused networks

_Command Explain_
- `network ls` ---> Lists Docker networks.
- `network create` ---> Creates a network for container communication.
- `network inspect` ---> Shows network settings and connected containers.
- `--network app-network` ---> Connects a newly created container to the network.
- `network connect` / `disconnect` ---> Attaches or detaches an existing container.
- `network rm` ---> Removes an unused network.
- `network prune` ---> Removes unused networks.
EOF

## 10. Docker Hub and Registries
docker login                                           # Sign in to the default registry
docker login <registry-url>                            # Sign in to a specified registry
docker tag my-nginx:1.0 <dockerhub-user>/my-nginx:1.0  # Tag image for your Docker Hub account
docker push <dockerhub-user>/my-nginx:1.0              # Push image to Docker Hub
docker pull <dockerhub-user>/my-nginx:1.0              # Pull image from Docker Hub
docker logout                                          # Sign out of the default registry
docker logout <registry-url>                           # Sign out of a specified registry

_Command Explain_
- `login` ---> Authenticates to a registry; use secure prompts or credential helpers.
- `<registry-url>` ---> Registry address, such as a private registry endpoint.
- `tag` ---> Adds a registry/repository tag to a local image.
- `push` ---> Uploads the tagged image to a registry.
- `pull` ---> Downloads an image.
- `logout` ---> Removes local login credentials for that registry.
- Replace `<dockerhub-user>` ---> Use your Docker Hub username without angle brackets.
EOF

## 11. Docker Compose
Use these commands when your project has a `compose.yaml` or `docker-compose.yml` file.

docker compose up                                     # Create/start services and show logs
docker compose up -d                                  # Create/start services in background
docker compose down                                   # Stop and remove Compose containers and networks
docker compose ps                                     # List Compose containers
docker compose logs                                   # Show service logs
docker compose logs -f                                # Follow service logs
docker compose build                                  # Build images defined in Compose
docker compose pull                                   # Pull service images
docker compose restart                                # Restart services
docker compose exec <service-name> sh                 # Run a shell in a running service container
docker compose down --volumes                         # Also remove Compose-managed volumes; data may be lost

_Command Explain_
- `up` ---> Creates and starts services defined in the Compose file.
- `-d` ---> Runs services in the background.
- `down` ---> Stops and removes Compose-created containers and networks.
- `ps` ---> Lists service/container status.
- `logs -f` ---> Follows service logs.
- `build` ---> Builds configured images.
- `pull` ---> Downloads configured images.
- `exec` ---> Runs a command inside a running service container.
- `down --volumes` ---> Also removes Compose-managed volumes; persistent data can be lost.
EOF

## 12. Cleanup and Disk Usage
docker system df                                      # Show Docker disk usage
docker system prune                                   # Remove selected unused Docker objects
docker system prune -a                                # Also remove unused images; review before running
docker builder prune                                  # Remove unused build cache
docker builder prune -a                               # Remove all unused build cache
docker container prune                                # Remove stopped containers
docker image prune                                    # Remove dangling images
docker network prune                                  # Remove unused networks
docker volume prune                                    # Remove unused volumes; data may be lost

_Command Explain_
- `system df` ---> Shows disk use by images, containers, volumes, and build cache.
- `system prune` ---> Removes selected unused Docker objects.
- `system prune -a` ---> Also removes images not used by existing containers.
- `builder prune` ---> Removes unused build cache.
- `container prune` ---> Deletes stopped containers.
- `image prune` ---> Deletes dangling images.
- `network prune` ---> Deletes unused networks.
- `volume prune` ---> Deletes unused volumes and their data. Review carefully before running.
EOF

## 13. Dockerfile Instructions
Example Dockerfile:
```dockerfile
FROM nginx:latest                         # Select the base image
LABEL app="nginx"                         # Add image metadata
WORKDIR /usr/share/nginx/html             # Set working directory inside the image
COPY index.html .                         # Copy local index.html into the image
RUN echo "Image build step"               # Execute a command during image build
ENV APP_ENV=production                    # Set an environment variable
ARG BUILD_VERSION=1.0                     # Define a build-time argument
EXPOSE 80                                 # Document the port used by the application
USER nginx                                # Run as nginx user, if permissions/image support it
CMD ["nginx", "-g", "daemon off;"]        # Default command when container starts
```

_Command Explain_
- `FROM` ---> Selects the base image.
- `LABEL` ---> Adds image metadata.
- `WORKDIR` ---> Sets the working directory for later instructions.
- `COPY` ---> Copies files from the build context into the image.
- `RUN` ---> Executes a command while building the image.
- `ENV` ---> Sets an environment variable available to the container.
- `ARG` ---> Defines a build-time argument, optionally overridden with `--build-arg`.
- `EXPOSE` ---> Documents a container port; it does not publish the port to the host.
- `USER` ---> Sets the user for subsequent instructions and the container process.
- `CMD` ---> Defines the default command/arguments when the container starts.
- `ENTRYPOINT` ---> Defines the main executable for the container.
- `ADD` ---> Adds files with extra archive/URL behavior; prefer `COPY` for ordinary copying.
- `VOLUME` ---> Declares a mount point intended for persistent or externally managed data.
EOF

## 14. Complete NGINX Practice Example
Folder structure:

```text
my-nginx/
├── Dockerfile
└── index.html
```

`Dockerfile`:

```dockerfile
FROM nginx:latest                         # Start from the NGINX image
COPY index.html /usr/share/nginx/html/index.html # Copy our web page into NGINX's web directory
EXPOSE 80                                 # Document the HTTP port
CMD ["nginx", "-g", "daemon off;"]        # Keep NGINX running in the foreground
```

`index.html`:

```html
<h1>Hello from Docker!</h1>
<p>NGINX is running inside a container.</p>
```

Build, run, and test:

```bash
docker build -t my-nginx:1.0 .                        # Build an image from this directory
docker run -d -p 8080:80 --name my-nginx-container my-nginx:1.0 # Run container and publish its port
docker ps                                             # Confirm the container is running
docker logs my-nginx-container                       # Check container logs
```

Open `http://localhost:8080` in your browser.

Stop and remove the container:

```bash
docker stop my-nginx-container                       # Gracefully stop the container
docker rm my-nginx-container                         # Remove the stopped container
```
EOF

## 15. Full `docker run` Command Explanation
docker run -d -p 8080:80 --name my-nginx-container my-nginx:1.0 # Run container

_Command Explain_
- `docker run` ---> Create and start a container.
- `-d` ---> Detached/background mode.
- `-p 8080:80` ---> Host port `8080` forwards to container port `80`.
- `--name my-nginx-container` ---> Give the container a name.
- `my-nginx:1.0` ---> Image used to create the container.
EOF

## 16. Safety Notes
- Do not put passwords, access keys, or other secrets in Dockerfiles or image layers.
- Use trusted images and pin versions/digests when repeatability and security matter.
- Be careful with `docker system prune`, `docker volume prune`, and `docker compose down --volumes`; they can remove data or cached images.
- `EXPOSE` documents a container port; `-p` publishes a port to the host.
- A container's writable layer is generally ephemeral. Use volumes or bind mounts for data that must survive container replacement.
- Docker commands require suitable permissions to access the Docker engine.

**End of Docker command reference.**
