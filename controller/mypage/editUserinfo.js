const { user } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");
const db = require("../../db/connection");
const refreshTokenRequest = require("../users/refreshTokenRequest");
const con = require("../../db/connection");

module.exports = async (req, res) => {
  // console.log(req);
  const { userID, nickname, password } = req.body;
  // console.log(req.body.headers);
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    refreshTokenRequest(req, res);
  }
  // console.log(accessTokenData);
  const { userId } = accessTokenData;
  // const userInfo = await user.findOne({ where: { userId } });
  // console.log(req.body);
  if (password && !nickname) {
    console.log("비번");
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `update users set password = '${password}', updatedAt = now() where userId = '${userId}' `
      );
    });
    res.status(200).json({ message: "비번 정보가 변경 되었습니다" });
  } else if (nickname && !password) {
    console.log("닉넴");
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `update users set nickname = '${nickname}', updatedAt = now() where userId = '${userId}' `
      );
    });
    res.status(200).json({ message: "닉넴 정보가 변경 되었습니다" });
  } else if (password && nickname) {
    console.log("비번 & 닉넴");
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `update users set nickname = '${nickname}', updatedAt = now() where userId = '${userId}' `
      );
      db.query(
        `update users set password = '${password}', updatedAt = now() where userId = '${userId}' `
      );
    });
    res.status(200).json({ message: "비번 & 닉넴 정보가 변경 되었습니다" });
  } else {
    res.status(400).json({ message: "양식에 맞는 정보를 입력해주세요" });
  }
};
