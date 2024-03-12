const express = require("express");
const api = require("./api")

const app = express();
app.use(express.json());
app.use("/api", api);

app.get("/", (req, res) => {
    res.send("server mongo activated");
});

app.listen(8080, () => console.log("server is running on 8080"));

process.on("SIGINT", () => {
    console.log("zamykanie połącznia z mongo");
    db.close(() => process.exit());
});