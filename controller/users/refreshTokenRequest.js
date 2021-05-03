const {
  checkRefeshToken,
  generateAccessToken,
  sendAccessToken,
} = require("../tokenFunctions");

const db = require("../../db/connection");
// const { user } = require("../../models");

module.exports = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    // return res.status(403).send("refresh token does not exist, you've never logged in before");
    return res.json({ data: null, message: "refresh token not provided" });
  }

  const refreshTokenData = checkRefeshToken(refreshToken);
  if (!refreshTokenData) {
    return res.json({
      data: null,
      message: "invalid refresh token, please log in again",
    });
  }
  db.query("use test", (err) => {
    if (err) {
      return res.status(200).send("데이터베이스에 연결하지 못했습니다");
    }
    console.log(req.body.userId);
    db.query(
      `select * from users where userId = '${req.body.userId}'`,
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
        sendAccessToken(res, accessToken, result);
      }
    );
  });

  // const { userId } = refreshTokenData;
  // user
  //   .findOne({ where: { userId } })
  //   .then((data) => {
  //     if (!data) {
  //       return res.json({
  //         data: null,
  //         message: "refresh token has been tempered",
  //       });
  //     }
  //     delete data.dataValues.password;

  //     const newAccessToken = generateAccessToken(data.dataValues);
  //     sendAccessToken(res, newAccessToken, data.dataValues);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
