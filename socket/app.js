import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";

import Routes from "./routes";

import { config, connectDB, cors, Driver } from "@odd_common/common";
import { Server } from "socket.io";
import {
  createChannel,
  publishMessage,
  subscribeMessage,
} from "./amqplib/connection";

var app = express();
connectDB();

const channel = await createChannel();

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

const io = new Server(server, {
  /* options */
  cors: {
    origin: "*:*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  path: "/mysocket",
  allowEIO3: true,
});

app.io = io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("updateCoordinate", async ({ driver_id, coordinates }) => {
    // console.log("jh", coordinates);
    await Driver.findByIdAndUpdate(driver_id, {
      "location.coordinates": coordinates,
    });
  });
});

const service = (payload) => {
  const { room, data, event } = JSON.parse(payload);
  // console.log({ room, data, event });
  switch (event) {
    case "NEW_ORDER":
      {
        io.to(room).emit(event, data);
      }
      break;
    case "STATUS_CHANGE":
      {
        io.to(room).emit(event, data);
      }
      break;
  }
};

subscribeMessage(channel, service, "NEW_ORDER");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// app.use("/", Routes);
app.get("/", (req, res, next) => {
  res.send("heelo");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.PORT);
app.set("port", port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  // console.log("Listening on " + bind);
}

export default app;
