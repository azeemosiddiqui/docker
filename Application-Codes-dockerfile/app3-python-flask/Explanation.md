## Dockerfile Guide for Intern DevOps Engineers (Python Edition)

### What Is a Dockerfile? (Python Edition)

A **Dockerfile** is a plain text file with step-by-step instructions. It tells Docker how to package your Python app so it runs the same way on every computer.

Think of it like a **cooking recipe**:

| Cooking | Docker |
|---|---|
| Recipe (written steps) | **Dockerfile** |
| Cooked dish, packed in a box | **Image** |
| Serving the dish and eating it | **Container** (a running image) |
| Each step in the recipe | **Layer** |

Docker reads the Dockerfile **from top to bottom**, one instruction at a time. The final result is an **image**: a packed copy of your app plus everything it needs to run.

### Why do we need a Dockerfile for a Python app?

Without Docker, a Python project often hits the famous problem: **"It works on my laptop, but not on the server!"**

Common reasons this happens:

- Your laptop has Python **3.12**, but the server has Python **3.8**.
- You installed a library with `pip` on your laptop and forgot to add it to `requirements.txt`.
- Two projects need **different versions** of the same library and they clash.
- Your laptop is Windows or Mac, but the server is Linux.
- The server does not have Python or pip installed at all.

A Dockerfile fixes this because it writes down **everything** in one file:

1. Which Python version to use
2. Which files to copy
3. Which libraries to install
4. How to start the app

Now anyone (a teammate, a CI pipeline, a cloud server) can build the image and get the **exact same result**.

### The big picture: from code to running app

```text
Your Python code             Docker reads              Docker builds           Docker runs
(app.py, requirements.txt) + the Dockerfile    --->    an IMAGE        --->    a CONTAINER
                             (the recipe)              (docker build)          (docker run)
```

Two commands are enough to remember:

```bash
docker build -t my-python-app .          # Dockerfile  -> Image
docker run -p 5000:5000 my-python-app    # Image       -> Running container
```

### What is a "layer"? (Very important for Python)

Each instruction in the Dockerfile creates one **layer**, like stacking sheets of paper. Docker **saves (caches)** every layer. On the next build, if a layer has not changed, Docker reuses it instead of doing the work again.

Here is how the layers look for our Python Dockerfile:

```text
Layer 7  CMD ["python", "app.py"]    <- how to start the app (no files added)
Layer 6  EXPOSE 5000                 <- note about the port (no files added)
Layer 5  COPY app.py .               <- your code          (changes OFTEN)
Layer 4  RUN pip install ...         <- installed libraries (changes SOMETIMES)
Layer 3  COPY requirements.txt .     <- dependency list    (changes SOMETIMES)
Layer 2  WORKDIR /app                <- working folder     (almost NEVER changes)
Layer 1  FROM python:3.12-slim       <- Python + Linux     (almost NEVER changes)
```

**The golden rule:** put things that change **rarely** at the top and things that change **often** at the bottom.

**Why it matters for Python:** `pip install` is usually the slowest step (it can take minutes when you have libraries like pandas or numpy). Your `app.py` changes many times a day. Because we copy `requirements.txt` and run `pip install` **before** copying `app.py`, Docker reuses the cached install layer when only your code changes. Your rebuild then takes **seconds instead of minutes**.

> If a layer changes, Docker rebuilds that layer **and every layer below it**. That is why the order of instructions matters.

### Key Python words you will see in this guide

| Word | Simple meaning |
|---|---|
| **Python** | The programming language and the program that runs your `.py` files. |
| **pip** | Python's package manager. It downloads the libraries your app needs. |
| **requirements.txt** | A file listing the libraries (and versions) your app needs, one per line. |
| **site-packages** | The folder where pip stores the installed libraries. |
| **`python app.py`** | The command that runs your Python file. |
| **Port 5000** | The "door number" your app listens on for requests (the default for Flask). |
| **slim image** | A smaller version of the Python image with fewer extra tools. |
| **pip cache** | Downloaded install files that pip keeps for reuse. Useful on a laptop, useless inside an image. |

### How to read the rest of this guide

For every instruction we answer four simple questions:

- **What** - what does this command do?
- **Why** - why do we need it in a Python project?
- **When** - at which stage does it happen (build time or run time)?
- **How** - how do we write it?

---

## Common Doubt: Is Python a Backend Language? Does It Render the UI?

### Short answer

Python is a **general-purpose language**. It is used for backend web apps, but also for automation scripts, data analysis, machine learning and more. When Python is used for web development, it works on the **backend (server side)**.

Python does **not** draw the UI by itself. The **browser** draws the UI using **HTML, CSS and JavaScript**. Python's job is to receive a request, do the work, and send back a response.

### Frontend vs Backend in simple words

Think of a restaurant:

| Restaurant | Web app |
|---|---|
| Menu, tables, decoration (what the customer sees) | **Frontend (UI)**: HTML, CSS, JavaScript running in the browser |
| Kitchen (where the food is prepared) | **Backend**: Python code running on the server (inside our container) |
| Waiter carrying orders and food | **HTTP requests and responses** |

### What happens when you open `http://localhost:5000`

```text
1. Browser  --- "GET /" request ------------>  Python (Flask) in the container
2. Python runs your code for that URL
3. Browser  <-- response (HTML or JSON) ----  Python sends the answer back
4. Browser reads the HTML and DRAWS the page on your screen
```

So Python **sends** the response, and the browser **renders** the UI.

### Can Python send a UI at all?

Yes, in two common ways:

| Style | What Python sends | Who builds the UI |
|---|---|---|
| **Server-side rendering** | A ready HTML page (Flask can do this using templates) | Python creates the HTML, the browser displays it |
| **API (JSON)** | Only data, like `{"message": "hello"}` | A separate frontend (React, Angular, Vue or mobile app) builds the UI |

In real projects, the API style is very common. In this guide, our app is a **backend** app running inside a container.

---

## What Is Flask? Why Do We Use It Here?

### What is Flask?

**Flask** is a small and popular Python **web framework**. A web framework is a ready-made toolkit that helps you build a web server without writing everything from scratch.

### Why do we need it?

Plain Python can run a script, but it cannot easily listen for browser requests. A web server has to handle many boring jobs:

- Listen on a port (like 5000)
- Understand HTTP requests (GET, POST and so on)
- Match a URL such as `/` or `/api/hello` to the right Python function
- Build and send the response back

Flask does all of this for you. You only write simple functions.

### Why Flask in this Dockerfile?

| Dockerfile line | Connection to Flask |
|---|---|
| `COPY requirements.txt .` and `RUN pip install ...` | `requirements.txt` contains `Flask`, so pip installs it into the image. |
| `COPY app.py .` | `app.py` is the file that creates the Flask web server. |
| `EXPOSE 5000` | **5000 is Flask's default port.** |
| `CMD ["python", "app.py"]` | Starts the Flask server when the container starts. |

> **Note:** The Dockerfile works for any Python app. We use Flask in this example because it is the simplest way to show a Python app that listens on a port.

### How to use it: a minimal example

**`requirements.txt`** (the libraries to install)

```text
Flask==3.0.3
```

**`app.py`** (the application)

```python
from flask import Flask, jsonify

# Create the Flask application
app = Flask(__name__)

# Route 1: returns a simple HTML page
@app.route("/")
def home():
    return "<h1>Hello from Flask running in Docker!</h1>"

# Route 2: returns JSON data (this is how an API works)
@app.route("/api/hello")
def hello_api():
    return jsonify(message="Hello from the Python backend")

# Start the server
if __name__ == "__main__":
    # host="0.0.0.0" lets traffic from outside the container reach the app
    app.run(host="0.0.0.0", port=5000)
```

### Understanding the code line by line

| Code | Simple meaning |
|---|---|
| `from flask import Flask, jsonify` | Bring in the tools we need from the Flask library. |
| `app = Flask(__name__)` | Create our web application. |
| `@app.route("/")` | "When someone visits the `/` URL, run the function below." |
| `def home(): return "<h1>...</h1>"` | The function sends back HTML. The browser shows it as a heading. |
| `jsonify(message="...")` | Converts a Python value into JSON for APIs. |
| `app.run(host="0.0.0.0", port=5000)` | Start the server on port 5000 and accept outside connections. |

### Try it

```bash
docker build -t my-python-app .
docker run -p 5000:5000 my-python-app
```

Then open these in your browser:

- `http://localhost:5000/` shows the HTML heading (the browser renders it)
- `http://localhost:5000/api/hello` shows the JSON data

### Important notes for Flask in Docker

- **Use `0.0.0.0`**: If you use `127.0.0.1`, the app is reachable only inside the container and your browser cannot connect.
- **Copy extra folders if you use them**: Our Dockerfile copies only `app.py`. If your app uses HTML templates or static files, add lines like `COPY templates/ templates/` and `COPY static/ static/`.
- **Flask's built-in server is for development**: For production, use a production server such as **Gunicorn**, for example `CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]`.
- **Other frameworks work the same way**: Django and FastAPI follow the same Dockerfile pattern. Only the libraries, the start command and sometimes the port change (FastAPI and Django usually use port 8000).

---

## The Complete Dockerfile

```dockerfile
# 1. Use Python as the base image
FROM python:3.12-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the dependency file into the container
COPY requirements.txt .

# 4. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy application code into the container
COPY app.py .

# 6. Document the application's container port
EXPOSE 5000

# 7. Start the Python application
CMD ["python", "app.py"]
```

---

## Instruction-by-Instruction Explanation

### 1. `FROM python:3.12-slim` - Choose the base image

| | |
|---|---|
| **What** | Picks the starting image we build on top of. |
| **Why** | We need Python to run our app. Instead of installing it ourselves, we reuse an official image that already has Python and pip. |
| **When** | Always the **first** instruction in a Dockerfile. |
| **How** | `FROM <image>:<tag>` |

- `python` is the image name.
- `3.12-slim` means Python version 3.12 on a smaller Linux with fewer extra tools. This gives faster downloads and fewer security risks.

> **Tip:** Always pin a version like `3.12`. If you write only `python`, you get the "latest" version, which can change and break your app one day.

---

### 2. `WORKDIR /app` - Set the working folder

| | |
|---|---|
| **What** | Sets the folder inside the container where the next commands run. |
| **Why** | Keeps our files in one clean place instead of mixing them with system files. It is like running `cd /app` for all later steps. |
| **When** | Before `COPY`, `RUN` and `CMD`, so they all use this folder. |
| **How** | `WORKDIR <path>` |

If `/app` does not exist, Docker creates it automatically.

---

### 3. `COPY requirements.txt .` - Bring in the dependency list

| | |
|---|---|
| **What** | Copies `requirements.txt` from your computer into the image. "requirements.txt" should list every third-party library your app imports, one per line. Libraries that come with Python (os, json, time and so on) do not go in it.|
| **Why** | `requirements.txt` lists the libraries our app needs. pip needs this file before it can install them. |
| **When** | **Before** `pip install`. |
| **How** | `COPY <source on your computer> <destination in image>` |

The `.` means the current folder, which is `/app` because of `WORKDIR`.

> **Why copy this file first, before `app.py`?**
> Docker caches layers. If only `app.py` changes later, Docker skips the slow `pip install` step and the build becomes much faster.

---

### 4. `RUN pip install --no-cache-dir -r requirements.txt` - Install dependencies

| | |
|---|---|
| **What** | Runs pip while the image is being built, to install every library from `requirements.txt`. |
| **Why** | Downloads all libraries so the app can work inside the container. |
| **When** | At **build time** (when you run `docker build`), not when the container starts. The result is saved inside the image. |
| **How** | `RUN <any shell command>` |

Let us break the command into parts:

- `pip install` - install Python libraries.
- `-r requirements.txt` - read the list of libraries from this file (`-r` means "requirements file").
- `--no-cache-dir` - tell pip **not to keep** its download cache. That cache is only useful for installing again later, which never happens inside an image. Skipping it makes the final image **smaller**.

> **Tip:** Use `RUN` for setup tasks and `CMD` for starting the app.

---

### 5. `COPY app.py .` - Bring in the application code

| | |
|---|---|
| **What** | Copies our application code into the image. |
| **Why** | The container needs our code to actually run the app. |
| **When** | **After** `pip install`. Code changes often, so we put it later to keep the cached dependency layer from step 4 unchanged. |
| **How** | Same as step 3: `COPY <source> <destination>` |

---

### 6. `EXPOSE 5000` - Document the port

| | |
|---|---|
| **What** | Tells people and tools that the app listens on port 5000. |
| **Why** | It works as documentation, so the next engineer knows which port to use. |
| **When** | Any time before `CMD`. Usually placed near the end. |
| **How** | `EXPOSE <port>` |

> **Important:** `EXPOSE` does **not** open the port to the outside world. To actually reach the app, publish the port with `-p`:
>
> ```bash
> docker run -p 5000:5000 <image-name>
> ```
>
> The format is `host-port:container-port`.

> **Python tip:** Your app must listen on `0.0.0.0`, not only `127.0.0.1`. For example, in Flask use `app.run(host="0.0.0.0", port=5000)`. If it listens only on `127.0.0.1`, it is reachable only from inside the container and your browser will not connect.

---

### 7. `CMD ["python", "app.py"]` - The start command

| | |
|---|---|
| **What** | Defines the default command that runs when the container starts. |
| **Why** | A container needs a main process to run. Here it starts our Python app. |
| **When** | At **run time** (when you run `docker run`), not during build. |
| **How** | `CMD ["executable", "argument"]` |

- This list style is called **exec form** and is the recommended way.
- Use only **one** `CMD`. If there are several, only the last one counts.
- It runs the same command you would type in a terminal: `python app.py`.

---

## Quick Usage

```bash
# Build the image
docker build -t my-python-app .

# Run a container
docker run -p 5000:5000 my-python-app

# Open in browser
# http://localhost:5000
```

---

## Build Time vs Run Time

This is a very common beginner confusion.

| Stage | Instructions | Happens when |
|---|---|---|
| **Build time** | `FROM`, `WORKDIR`, `COPY`, `RUN` | You run `docker build` |
| **Run time** | `CMD` | You run `docker run` |

---

## Quick Reference (Hinglish)

| Instruction | Matlab |
|---|---|
| `FROM` | Python runtime wali base image select karta hai. |
| `WORKDIR` | Container ke andar `/app` working directory set karta hai. |
| `COPY requirements.txt .` | Dependency file image mein copy karta hai. |
| `RUN pip install` | Image build karte waqt Python dependencies install karta hai. |
| `COPY app.py .` | Application code copy karta hai. |
| `EXPOSE 5000` | Intended container port document karta hai. |
| `CMD` | Container start hone par `python app.py` chalata hai. |

---

## Interview Explanation (Say It in Your Own Words)

A Dockerfile is a text file that contains step-by-step instructions telling Docker how to package an application so it runs the same way on any machine. For a Python app, I start with `FROM python:3.12-slim`, which gives me a ready-made Linux system with Python and pip already installed, and I pin the version so my builds stay predictable. Then `WORKDIR /app` sets the folder inside the container where all my work happens. Next, I copy `requirements.txt` first and run `pip install --no-cache-dir -r requirements.txt`, and only after that I copy my application code with `COPY app.py .`. I do it in this order on purpose, because Docker caches each step as a layer. Libraries change rarely, but code changes often, so when I edit only my code, Docker reuses the cached `pip install` layer and the rebuild takes seconds instead of minutes. The `--no-cache-dir` flag stops pip from saving its download cache, which keeps the final image smaller. `EXPOSE 5000` documents that the app listens on port 5000, but it doesn't actually open the port, so I still need `docker run -p 5000:5000` to reach the app from outside, and my app must listen on `0.0.0.0` instead of `127.0.0.1`. Finally, `CMD ["python", "app.py"]` defines what runs when the container starts. One important point is the difference between build time and run time: `FROM`, `WORKDIR`, `COPY` and `RUN` happen when I run `docker build` and create the image, while `CMD` runs only when I run `docker run` and start the container. The main benefit of all this is consistency: the image contains the exact Python version, libraries and code, so it avoids the "it works on my laptop but not on the server" problem.

### Common Follow-Up Questions

**Q: What is the difference between `CMD` and `RUN`?**
`RUN` executes during the build and saves the result in the image (for example, installing libraries). `CMD` executes when the container starts and defines the main process.

**Q: What is the difference between an image and a container?**
An image is the packaged, read-only blueprint. A container is a running instance created from that image. You can start many containers from one image.

**Q: Why did you use the slim image?**
It is smaller, so it downloads faster, uses less storage and has fewer packages that could contain security problems.

**Q: Does `EXPOSE` publish the port?**
No. It only documents the port. You publish it with `docker run -p host:container`.

**Q: Is Python a backend language? Does it render the UI?**
Python is a general-purpose language that is widely used for the backend. It does not draw the UI. It receives requests and sends back HTML or JSON, and the browser (or a frontend app like React) renders the UI.

**Q: What is Flask and why did you use it?**
Flask is a lightweight Python web framework. It handles the work of listening on a port, understanding HTTP requests and mapping URLs to Python functions, so I can build a web app or API with very little code. Its default port is 5000, which is why the Dockerfile exposes 5000.

**Q: Why must the app listen on `0.0.0.0` inside a container?**
`127.0.0.1` means "only this container", so outside traffic cannot reach it. `0.0.0.0` means "accept connections from any network interface", which lets the `-p 5000:5000` port mapping work.

**Q: Is Flask's built-in server fine for production?**
No. It is meant for development. In production I would use a production server such as Gunicorn.

**Q: How can you make this Dockerfile better?**
Add a `.dockerignore` file to keep unneeded files out of the image, run the app as a non-root user for security, and use a production server such as Gunicorn instead of running `python app.py` directly.
