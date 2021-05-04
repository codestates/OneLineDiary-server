// const { user } = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../tokenFunctions");
const db = require("../../db/connection");

module.exports = (req, res) => {
  // const { userId, password } = req.body;
  db.query("use test", (err) => {
    if (err) {
      return res.status(200).send("데이터베이스에 연결하지 못했습니다");
    }
    console.log(req.body.userId);
    db.query(
      `select * from users where userId = '${req.body.userId}' and password = '${req.body.password}'`,
      (err, data) => {
        if (err) {
          return res.status(400).json({ message: "일치하는 정보가 없습니다" });
        }
        if (data.length === 0) {
          // return res.status(401).send({ data: null, message: 'not authorized' });
          return res.status(400).json({ message: "일치하는 정보가 없습니다" });
        }
        delete data[0].password;
        const result = {
          id: data[0].id,
          userId: data[0].userId,
          nickname: data[0].nickname,
          password: data[0].password,
          createdAt: data[0].createdAt,
          updatedAt: data[0].updatedAt,
        };
        console.log(result);
        const accessToken = generateAccessToken(result);
        const refreshToken = generateRefreshToken(result);
        console.log(accessToken);
        sendRefreshToken(res, refreshToken);
        sendAccessToken(res, accessToken, result);
      }
    );
  });
  //sequelize로 만들 때
  // user
  //   .findOne({
  //     where: {
  //       userId,
  //       password,
  //     },
  //   })
  //   .then((data) => {
  //     if (!data) {
  //       // return res.status(401).send({ data: null, message: 'not authorized' });
  //       return res.json({ data: null, message: "not authorized" });
  //     }
  //     console.log(data.dataValues);
  //     delete data.dataValues.password;
  //     const accessToken = generateAccessToken(data.dataValues);
  //     const refreshToken = generateRefreshToken(data.dataValues);
  //     console.log(accessToken);
  //     sendRefreshToken(res, refreshToken);
  //     sendAccessToken(res, accessToken, data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// 아이디와 비밀번호를 받으면 db에 있는지 확인하고 없으면 에러
// 있으면 토큰 발급
//sequelize 다른 방법

// const jwt = require("jsonwebtoken");
// module.exports = async (req, res) => {
//   const userInfo = await user.findOne({
//     where: { userId: req.body.userId, password: req.body.password },
//   });
//   // 아이디 비밀번호가 db에 없는 경우
//   if (!userInfo) {
//     const fail = { data: null, message: "not authorized" };
//     res.status(400).send(fail);
//   }
//   // 아이디 비밀번호가 db에 있는 경우
//   else {
//     //.env 파일에 ACCESS_SECRET, REFRESH_SECRET 변수명을 저장하고 임의의 값을 준다.
//     process.env.ACCESS_SECRET = "first";
//     process.env.REFRESH_SECRET = "project";
//     const data = userInfo.dataValues;
//     // exp : 만료시간 > 현재시간 이후로 값을 작성해야한다고 하는데 일단 아무값 넣음, iat : 발급시점 > 0보다 큰 숫자이고 문자열 아니라고 해서 아무값 넣음
//     // 토큰 생성
//     const accessToken = jwt.sign(
//       {
//         id: data.id,
//         userId: data.userId,
//         createdAt: data.createdAt,
//         updatedAt: data.updatedAt,
//         exp: 1493833746,
//         iat: 1493833746,
//       },
//       process.env.ACCESS_SECRET
//     );
//     const refreshToken = jwt.sign(
//       {
//         id: data.id,
//         userId: data.userId,
//         createdAt: data.createdAt,
//         updatedAt: data.updatedAt,
//         exp: 1493833746,
//         iat: 1493833746,
//       },
//       process.env.REFRESH_SECRET
//     );
//     const success = { data: { accessToken: accessToken }, message: "ok" };

//     // sameSite : 서로 다른 도메인간의 쿠키 전송에 대한 보안 none을 설정하면 secure를 설정해주어야함
//     // secure : https에서만 동작하게 한다.
//     // httpOnly : 해당 옵션이 true로 설정된 경우, 자바스크립트에서는 쿠키에 접근이 불가
//     res.cookie("refreshToken", refreshToken, {
//       sameSite: "none",
//       secure: "true",
//       httpOnly: "true",
//     });
//     res.status(200).send(success);
//   }
// };
