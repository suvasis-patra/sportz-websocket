import express from "express";
import { matchRouter } from "./routes/match.route.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use("/matches", matchRouter);

app.listen(8080, () => console.log("server is running in port 8080"));
