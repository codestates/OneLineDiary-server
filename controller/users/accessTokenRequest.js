const { isAuthorized } = require("../tokenFunctions");
// const { Users } = require("../../models");
const db = require("../../db/connection");

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    return res.json({ data: null, message: "invalid access token" });
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
        return res.json({ data: { userInfo: result }, message: "ok" });
      }
    );
  });
  // const { userId } = accessTokenData;
  // console.log(userId);
  // Users.findOne({ where: { userId } })
  //   .then((data) => {
  //     if (!data) {
  //       // return res.status(401).send({ data: null, message: 'not authorized' });
  //       return res.json({
  //         data: null,
  //         message: "access token has been tempered",
  //       });
  //     }
  //     delete data.dataValues.password;
  //     return res.json({ data: { userInfo: data.dataValues }, message: "ok" });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
