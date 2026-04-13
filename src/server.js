import http from "http";
import express from "express";
import { matchRouter } from "./routes/match.route.js";
import { attachWebsocketServer } from "./websocket/server.js";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use("/matches", matchRouter);

const { broadcastCreatedMatch } = attachWebsocketServer(server);
app.locals.broadcastCreatedMatch = broadcastCreatedMatch;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`server is running at ${baseUrl}`);
  console.log(
    `websocket server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
