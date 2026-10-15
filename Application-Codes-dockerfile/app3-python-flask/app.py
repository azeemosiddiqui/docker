from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello Brother! My first Dockerized Python App is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


#Easy explanation:
#Flask(__name__) — Will create web application
#@app.route("/") — define the homepage URL.
#return — It will display bthe message in the browser.
#host="0.0.0.0" — Make appication accessible on container network interface.
#port=5000 — Application runs on port 5000 inside container