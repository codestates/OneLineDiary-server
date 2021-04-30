const { user } = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../tokenFunctions");

module.exports = (req, res) => {
  const { userId, password } = req.body;
  user
    .findOne({
      where: {
        userId,
        password,
      },
    })
    .then((data) => {
      if (!data) {
        // return res.status(401).send({ data: null, message: 'not authorized' });
        return res.json({ data: null, message: "not authorized" });
      }
      delete data.dataValues.password;
      const accessToken = generateAccessToken(data.dataValues);
      const refreshToken = generateRefreshToken(data.dataValues);

      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, accessToken);
    })
    .catch((err) => {
      console.log(err);
    });
};

//로그인 하면 토큰이 발급 된다.

// 아이디와 비밀번호를 받으면 db에 있는지 확인하고 없으면 에러
// 있으면 토큰 발급
//sequelize

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
