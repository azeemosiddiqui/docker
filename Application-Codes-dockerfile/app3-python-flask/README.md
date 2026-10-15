# Python Backend vs Web Application --- Easy Notes

## 1. Is Python a backend language?

Yes, Python is commonly used for backend development. But Python can
also be used to build web applications.

A **web application** is software that users access through a web
browser. It can include a frontend, a backend, or both.

Python frameworks such as **Flask** and **Django** help Python receive
HTTP requests and send HTTP responses. They can also generate HTML
pages.

## 2. Frontend vs Backend

  -----------------------------------------------------------------------
  Part                    What it does            Common technologies
  ----------------------- ----------------------- -----------------------
  **Frontend**            The part users see and  HTML, CSS, JavaScript,
                          interact with: page     React
                          design, buttons, forms, 
                          images, and menus.      

  **Backend**             The part that works     Python, Java, Node.js,
                          behind the scenes:      .NET
                          login checks, business  
                          logic, processing       
                          orders, and             
                          communicating with a    
                          database.               

  **Database**            Stores and retrieves    PostgreSQL, MySQL,
                          application data, such  MongoDB
                          as users and orders.    
  -----------------------------------------------------------------------

## 3. Restaurant example

Imagine that a customer orders biryani from a restaurant website.

1.  **Frontend:** The customer sees the menu and clicks the **Order**
    button.
2.  **Backend:** The Python application receives the order request and
    processes it.
3.  **Database:** The application may save the order details in a
    database.
4.  **Response:** The backend sends a response, and the frontend
    displays the result to the customer.

Simple flow:

``` text
Customer / Browser
        |
        | HTTP request
        v
Frontend (HTML, CSS, JavaScript / React)
        |
        | API request
        v
Backend (Python Flask / Django)
        |
        | Query or update data
        v
Database (PostgreSQL / MySQL)
```

## 4. How did the Python message appear in the browser?

In our Docker example, we used this Flask code:

``` python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello Bhai! My first Dockerized Python App is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

Here is what happens when you open `http://localhost:5000`:

1.  The browser sends an HTTP request to the Flask server.
2.  Flask matches the `/` route.
3.  Python runs the `home()` function.
4.  The function returns a text response.
5.  The browser displays that text.

**Important:** This example does not have a separate frontend. The
browser is displaying plain text returned by the Python backend. It is a
basic web application/server example, not a complete frontend website.

The setting `host="0.0.0.0"` allows the application to listen on the
container's network interfaces. `port=5000` tells Flask to listen on
port 5000 inside the container.

## 5. How does Docker fit into this?

Docker packages an application and its required dependencies into an
image. A container is a running instance of that image.

For our Flask example, the Dockerfile could look like this:

``` dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
```

The `requirements.txt` file contains:

``` text
flask
```

Build the image from the directory containing the Dockerfile:

``` bash
docker build -t app3-python:v1 .
```

Run a container and publish its port:

``` bash
docker run -d -p 5000:5000 --name app3-python-container app3-python:v1
```

Then open `http://localhost:5000` in your browser.

### What does `-p 5000:5000` mean?

``` text
Host machine port 5000  --->  Container port 5000
```

-   The **first `5000`** is the port on your computer (host).
-   The **second `5000`** is the port inside the container.
-   `EXPOSE 5000` documents the container port, but it does **not**
    publish that port by itself.
-   `-p` publishes/maps the port so your computer can connect to the
    container.

## 6. A common real-world architecture

A web application can use separate containers for the frontend, backend,
and database.

``` text
User's Browser
      |
      v
Frontend Container
React application served by NGINX
      |
      | HTTP API requests
      v
Backend Container
Python Flask / Django API
      |
      v
Database
PostgreSQL / MySQL
```

For example:

-   **Frontend container:** React files served by NGINX.
-   **Backend container:** Python Flask or Django handles API requests
    and application logic.
-   **Database:** PostgreSQL or MySQL stores application data.

These components can be packaged and deployed separately. In Kubernetes,
they can be managed using separate Deployments and Services.

## 7. Key points to remember

-   Python is commonly used for backend development.
-   Flask and Django let Python applications handle web requests and
    responses.
-   A browser can display plain text or HTML returned by a backend; a
    separate frontend is not required for a basic example.
-   A complete web application often has a frontend, backend, and
    database.
-   Docker packages an application and its dependencies into an image.
-   `EXPOSE` documents a container port; `docker run -p` publishes/maps
    the port.
-   Frontend and backend components can run in separate containers.

**Interview-ready answer:**

"Python is commonly used for backend development, but with frameworks
such as Flask and Django, it can also serve web pages and handle HTTP
requests. In a basic Flask example, the browser sends a request, Python
processes it, and Flask returns a response that the browser displays. In
a typical production application, the frontend, backend, and database
may be separate components and can be deployed in separate Docker
containers."
