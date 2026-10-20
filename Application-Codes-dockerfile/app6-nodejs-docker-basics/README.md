# App 6 — Basic Node.js Docker Instructions Lab

## Build the image
Run from this folder (the folder containing Dockerfile):

```bash
docker build -t app6-nodejs-basics:v1 .
```

`-t` names/tags the image; `.` means use the current folder as build context.

## Run the container
```bash
docker run -d --name app6-nodejs-basics -p 8086:3000 app6-nodejs-basics:v1
```
Open http://localhost:8086

- `-d`: run in the background.
- `--name`: assign a container name.
- `-p 8086:3000`: map computer port 8086 to container port 3000.

## Check logs
```bash
docker logs app6-nodejs-basics
docker ps
```

## Override PORT
```bash
docker run --rm -e PORT=4000 -p 8087:4000 app6-nodejs-basics:v1
```
Open http://localhost:8087. `-e PORT=4000` overrides the default ENV value.

## Override CMD
```bash
docker run --rm app6-nodejs-basics:v1 node --version
```
ENTRYPOINT still runs, but `node --version` replaces the default CMD `node app.js`.

## Stop and remove the named container
```bash
docker stop app6-nodejs-basics
docker rm app6-nodejs-basics
```

## Quick meaning
- `WORKDIR`: set the working directory inside the image.
- `COPY`: copy files/folders from the build context into the image.
- `ADD`: can automatically extract a local `.tar.gz` archive.
- `ENV`: set an environment variable.
- `EXPOSE`: document the container port; it does not publish it.
- `RUN`: execute a command during image build.
- `ENTRYPOINT`: set the main startup executable/script.
- `CMD`: provide the default command/arguments; `docker run IMAGE ...` can replace CMD.
