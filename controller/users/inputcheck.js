const db = require("../../db/connection");

module.exports = (req, res) => {
  const { userId, nickname } = req.body;
  if (userId && !nickname) {
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `select * from users where userId = '${userId}'`,
        (err, data) => {
          if (err) {
            throw error;
          }
          if (data.length === 0) {
            // 내용 없으면 아이디 사용 가능
            const message = {
              messages: "사용가능한 아이디입니다.",
              userId: true,
            };
            res.status(200).send(message);
          } else {
            //db에 정보가 있으면 에러 메세지 보낸다.
            const message = { messages: "이미 등록된 정보가 있습니다" };
            res.status(200).send(message);
          }
        }
      );
    });
  } else if (userId && nickname) {
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      db.query(
        `select * from users where nickname = '${nickname}'`,
        (err, data) => {
          if (err) {
            throw error;
          }
          if (data.length === 0) {
            // 내용 없으면 사용 가능
            const message = {
              messages: "사용가능한 닉네임입니다.",
              nickname: true,
            };
            res.status(200).send(message);
          } else {
            //db에 정보가 있으면 에러 메세지 보낸다.
            const message = { messages: "이미 등록된 정보가 있습니다" };
            res.status(200).send(message);
          }
        }
      );
    });
  }
};
