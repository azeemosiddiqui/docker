const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello Bhai! My fourth Docker example is running!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App listening on port ${PORT}`);
});