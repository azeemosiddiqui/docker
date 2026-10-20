// Read Node.js built-in modules.
const http = require("http");
const fs = require("fs");
const path = require("path");

// Read PORT from ENV. Use 3000 if it is not set.
const port = process.env.PORT || 3000;

// Docker ADD extracts public-assets.tar.gz into /app/assets/.
const messagePath = path.join(__dirname, "assets", "welcome.txt");
let message = "Welcome to my simple Node.js Docker app!";
try { message = fs.readFileSync(messagePath, "utf8").trim(); } catch (err) {
  console.log("Could not read welcome file:", err.message);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html><html><head><title>Docker Basics</title></head>
  <body style="font-family:Arial;max-width:700px;margin:60px auto;line-height:1.6">
  <h1>${message}</h1><p>This basic Node.js app is running inside Docker.</p>
  <p><b>PORT:</b> ${port}</p><p><b>URL path:</b> ${req.url}</p></body></html>`);
});
server.listen(port, "0.0.0.0", () => console.log(`App listening on port ${port}`));
