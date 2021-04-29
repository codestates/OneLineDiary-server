const express = require("express");
const cors = require("cors");
const session = require("express-session");
const logger = require("morgan");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 4000;

app.use(
  session({
    secret: "onelinediary",
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: "localhost",
      path: "/",
      maxAge: 24 * 6 * 60 * 10000,
      sameSite: "None",
      httpOnly: true,
      secure: true,
    },
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.get("/", (req, res) => {
  res.status(201).send({
    message: "Hello World!",
  });
});

let server;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https
    .createServer(
      {
        key: fs.readFileSync(__dirname + `/` + "key.pem", "utf-8"),
        cert: fs.readFileSync(__dirname + `/` + "cert.pem", "utf-8"),
      },
      app
    )
    .listen(port);
} else {
  server = app.listen(port, () => {
    console.log(`server listening on ${port}`);
  });
}

module.exports = server;
