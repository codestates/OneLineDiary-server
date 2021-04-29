const express = require("express");
const cors = require("cors");
const db = require("./db/connection");
const jwt = require("jsonwebtoken");
const { Users } = require(`'../../models'와 같은 model의 위치`);
const logger = require("morgan");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 4000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors 처리
app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);
//로그인 하면 토큰이 발급 된다.
app.post("/login", async (req, res) => {
  // 아이디와 비밀번호를 받으면 db에 있는지 확인하고 없으면 에러
  // 있으면 토큰 발급
  //sequelize
  const userInfo = await Users.fineOne({
    where: { userId: req.body.userId, password: req.body.password },
  });
  // 아이디 비밀번호가 db에 없는 경우
  if (!userInfo) {
    const fail = { data: null, message: "not authorized" };
    res.status(400).send(fail);
  }
  // 아이디 비밀번호가 db에 있는 경우
  else {
    //.env 파일에 ACCESS_SECRET, REFRESH_SECRET 변수명을 저장하고 임의의 값을 준다.
    process.env.ACCESS_SECRET = "first";
    process.env.REFRESH_SECRET = "project";
    const data = userInfo.dataValues;
    // exp : 만료시간 > 현재시간 이후로 값을 작성해야한다고 하는데 일단 아무값 넣음, iat : 발급시점 > 0보다 큰 숫자이고 문자열 아니라고 해서 아무값 넣음
    // 토큰 생성
    const accessToken = jwt.sign(
      {
        id: data.id,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        exp: 1493833746,
        iat: 1493833746,
      },
      process.env.ACCESS_SECRET
    );
    const refreshToken = jwt.sign(
      {
        id: data.id,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        exp: 1493833746,
        iat: 1493833746,
      },
      process.env.REFRESH_SECRET
    );
    const success = { data: { accessToken: accessToken }, message: "ok" };

    // sameSite : 서로 다른 도메인간의 쿠키 전송에 대한 보안 none을 설정하면 secure를 설정해주어야함
    // secure : https에서만 동작하게 한다.
    // httpOnly : 해당 옵션이 true로 설정된 경우, 자바스크립트에서는 쿠키에 접근이 불가
    res.cookie("refreshToken", refreshToken, {
      sameSite: "none",
      secure: "true",
      httpOnly: "true",
    });
    res.status(200).send(success);
  }
  //rds
});

//초반 helloworld 배포용
app.get("/", (req, res) => {
  res.status(201).send({
    message: "Hello World!",
  });
});

// mysql로 db 연결
// db 연결하는 주소
// 토큰은 2번째인자로 추가
app.get(`/어떤주소를 넣어야할지 모르겠음`, (req, res) => {
  db.query("use test", (err) => {
    if (err) {
      //db 연결에 실패할 경우 로그인만 되고 db는 안된다.
      return res.status(200).send({
        isLogin: true,
        isConnectedToDatabase: false,
      });
    }
    //성공할 경우 로그인과 db연결 둘다 true
    return res.status(200).send({
      isLogin: true,
      isConnectedToDatabase: true,
    });
  });
});

// app.listen(port, () => {
//   console.log(`서버가 http://localhost:${port}에서 작동 중입니다.`);
// });

//근화님 코드
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
