const { user, post, post_info, emoji } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");

module.exports = (req, res) => {
  //db에 저장하고 메세지를 보낸다.
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    return res.json({ data: null, message: "invalid access token" });
  }
  //   console.log(accessTokenData);
  const { userId, createdAt } = accessTokenData;
  console.log(
    accessTokenData,
    req.body.content,
    req.body.created_At,
    req.body.emoji
  );
  // updatedAt: createdAt > 최초 생성될 때는 업데이트 시간과 최초생성시간이 같다
  post.create({
    userId: userId,
    content: req.body.content,
    createdAt: createdAt,
    updatedAt: createdAt,
  });
  emoji.create({
    emoji: req.body.emoji,
    createdAt: createdAt,
    updatedAt: createdAt,
  });
  const message = { message: "오늘의 일기가 등록되었습니다" };
  res.status(200).send(message);
};
