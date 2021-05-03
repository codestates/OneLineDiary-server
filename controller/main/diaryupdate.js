const { user, post, post_info, emoji } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    return res.json({ data: null, message: "invalid access token" });
  }
  const contentInfo = await post.findOne({ where: { id: req.body.contentId } });
  console.log(contentInfo);
  // post.update(
  //   {
  //     content: req.body.content,
  //     updatedAt: new Date(),
  //   },
  //   { where: { id: req.body.contentId } }
  // );
  // emoji.update(
  //   { emoji: req.body.emoji, updatedAt: new Date() },
  //   {
  //     where: {
  //       // 이부분도 수정이 필요하다 emoji의 id를 받아와야할듯
  //       id: post_info.fineOne(emoji_id, {
  //         where: { post_id: req.body.contentId },
  //       }),
  //     },
  //   }
  // );

  const message = { message: "일기 내용을 수정했습니다" };
  res.status(200).send(message);
};
