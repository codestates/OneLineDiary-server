const { isAuthorized, checkRefeshToken } = require("../tokenFunctions");
const { user } = require("../../models");
const refreshTokenRequest = require("../users/refreshTokenRequest");

module.exports = (req, res) => {
  // 15초인 이유가 요청 할때마다 새로 토큰을 만들게? 만료가 되면 리프레시 토큰으로 불러와서 다시 발급
  // console.log(req);
  const accessTokenData = isAuthorized(req);
  // console.log(accessTokenData);
  //왜 같은 토큰을 넣어도 null이 나오지 >> 토큰 시간 만료 때문
  if (!accessTokenData) {
    if (req.cookies.refreshToken) {
      const refreshToken = req.cookies.refreshToken;
      refreshTokenRequest(req);
      const refreshTokenData = checkRefeshToken(refreshToken);
      const { userId } = refreshTokenData;
      user.findOne({ where: { userId } }).then((data) => {
        console.log("여기");
        res.json({
          userId: data.dataValues.userId,
          password: data.dataValues.password,
          nickname: data.dataValues.nickname,
          message: "ok",
        });
      });
    }
  } else {
    const { userId } = accessTokenData;
    console.log(accessTokenData);
    user
      .findOne({ where: { userId } })
      .then((data) => {
        if (!data) {
          // return res.status(401).send({ data: null, message: 'not authorized' });
          return res.json({
            data: null,
            message: "access token has been tempered",
          });
        }
        console.log("아님여기!");
        return res.json({
          userId: data.dataValues.userId,
          password: data.dataValues.password,
          nickname: data.dataValues.nickname,
          message: "ok",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
