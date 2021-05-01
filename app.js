const cors = require("cors");
const logger = require("morgan");
const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const controllers = require("./controller");

app.use(logger("dev"));
//cors 처리
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["https://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(cookieParser());

app.post("/user/login", controllers.usersController.login);
app.post("/user/signup", controllers.usersController.signup);
//request 값 없이 정보 불러오는게 맞음 이미 있으니까
app.get("/mypage/userinfo", controllers.mypageController.userinfo);
app.get("/main", controllers.mainController.main);

const port = 4000;

// 주소 확인할 때 > `https://localhost:{port}`
let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  console.log("good");
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(port, () => console.log("server runnning"));
} else {
  server = app.listen(port);
}
module.exports = server;

// app.listen(port, () => {
//   console.log(`server listening on ${port}`);
// });
