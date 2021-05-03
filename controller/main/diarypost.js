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
  // createdAt, updatedAt은 req 값으로 받지 않아도 될거같다. 자동으로 db에 추가된다.
  // 같은 내용은 여러번 입력할 수도 있으니 db를 검색안해도 될거 같음
  post.create({
    userId: userId,
    content: req.body.content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  emoji.create({
    emoji: req.body.emoji,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  post_info.create({
    post_id: post.id,
    // 수정이 필요하다. req에 받아오는 새로운 값이 필요할 것 같음
    emoji_id: emoji.findOne({ where: {} }),
  });
  const message = { message: "오늘의 일기가 등록되었습니다" };
  res.status(200).send(message);
};
