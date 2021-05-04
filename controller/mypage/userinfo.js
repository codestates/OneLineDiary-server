const { isAuthorized, checkRefeshToken } = require("../tokenFunctions");
const { user } = require("../../models");
const refreshTokenRequest = require("../users/refreshTokenRequest");
const db = require("../../db/connection");

module.exports = (req, res) => {
  // 15초인 이유가 요청 할때마다 새로 토큰을 만들게? 만료가 되면 리프레시 토큰으로 불러와서 다시 발급
  // console.log(req);
  const accessTokenData = isAuthorized(req);
  // console.log(accessTokenData);
  //왜 같은 토큰을 넣어도 null이 나오지 >> 토큰 시간 만료 때문
  if (!accessTokenData) {
    refreshTokenRequest(req, res);
    // 이러고 다시 원래 창으로 돌아가야하는데 이게 되는건가?
  } else {
    const { userId } = accessTokenData;
    console.log(accessTokenData);
    db.query("use test", (err, result) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `select * from users where userId = '${userId}' limit 1`,
        (err, data) => {
          // console.log(data);
          if (!data) {
            // return res.status(401).send({ data: null, message: 'not authorized' });
            return res.json({
              data: null,
              message: "access token has been tempered",
            });
          }
          console.log("asdasdasd", data[0]);
          return res.json({
            userId: data[0].userId,
            password: data[0].password,
            nickname: data[0].nickname,
            message: "ok",
          });
        }
      );
    });
  }
};
