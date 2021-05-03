const { user } = require("../../models");

module.exports = (req, res) => {
  const { userId, password, nickname } = req.body;
  console.log(userId, password, nickname);
  //입력받은 값이 부족하면 에러 메세지 보낸다.
  const keyLength = Object.keys(req.body).length;
  if (keyLength !== 3) {
    const message = { messages: "회원정보가 부족합니다" };
    res.status(400).send(message);
  } else {
    user
      .findOne({
        where: {
          userId: userId,
          password: password,
          nickname: nickname,
        },
      })
      .then((data) => {
        if (!data) {
          //db에 정보가 없으면 저장하고 로그인 창으로 돌려보낸다.
          // console.log(req.body);
          //db에 저장하는 부분
          user.create({
            userId: userId,
            password: password,
            nickname: nickname,
          });
          const message = { messages: "회원가입에 성공하셨습니다" };
          res.status(200).send(message);
        } else {
          //db에 정보가 있으면 에러 메세지 보낸다.
          const message = { messages: "이미 등록된 정보가 있습니다" };
          res.status(401).send(message);
        }
      });
  }
};
