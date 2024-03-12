const express = require("express");
const app = express();
const api = require("./api");

app.use(express.json());
app.use("/api", api);

app.get("/", (req, res) => {
    res.send("server mongo activated");
});

app.listen(8080, () => console.log("server is running on 8080"));   

process.on('SIGINT', () => {
    console.log("zamykanie połączenia z mongo")
    db.close(() => process.exit)
});