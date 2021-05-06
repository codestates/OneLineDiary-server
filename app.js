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
    methods: ["GET", "POST", "OPTIONS", "PATCH"],
  })
);
app.use(cookieParser());

// user
app.post("/user/login", controllers.usersController.login);
app.post("/user/logout", controllers.usersController.logout);
app.post("/user/signup", controllers.usersController.signup);
app.post("/user/inputcheck", controllers.usersController.inputcheck);
// mypage
app.get("/mypage/userinfo", controllers.mypageController.userinfo);

app.patch("/mypage/editUserinfo", controllers.mypageController.editUserinfo);
// post
app.get("/main", controllers.mainController.main);
app.post("/main/post", controllers.mainController.diarypost);
app.patch("/main/update", controllers.mainController.diaryupdate);
app.post("/main/delete", controllers.mainController.diarydelete);

const port = 80;

// 주소 확인할 때 > `https://localhost:{port}`
//let server;
//if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  //const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  //const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  //const credentials = { key: privateKey, cert: certificate };

  //server = https.createServer(credentials, app);
  //server.listen(port, () => console.log(`server listening on https ${port}`));
//} else {
  //server = app.listen(port, () => {
    //console.log(`server listening on http ${port}`);
  //});
//}

//module.exports = server;
 app.listen(port, () => {
   console.log(`server listening on ${port}`);
 });
