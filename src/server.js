import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(8080, () => console.log("server is running in port 8080"));
