const { isAuthorized } = require("../tokenFunctions");
const { post, post_info, emoji } = require("../../models");
const refreshTokenRequest = require("../users/refreshTokenRequest");
const db = require("../../db/connection");

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    refreshTokenRequest(req, res);
  }
  //req 의 contentId 값을 추적해서 지운다.
  else if (accessTokenData) {
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `select emoji_id from post_infos where post_id = '${req.body.contentId}'`,
        (err, result) => {
          console.log(result[0].emoji_id);
          db.query(`delete from emojis where id = ${result[0].emoji_id}`);
          db.query(`delete from posts where id = ${req.body.contentId}`);
          db.query(
            `delete from post_infos where post_id = ${req.body.contentId}`
          );
        }
      );
      const message = { message: "일기 내용이 삭제되었습니다." };
      res.status(200).send(message);
    });
  } else {
    res.status(500).json("err");
  }
};
