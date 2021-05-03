const { isAuthorized } = require("../tokenFunctions");
const { post } = require("../../models");

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req);
  const { contentId, userId, emoji, content } = req.body;
  const contentInfo = await post.findOne({ where: { id: contentId } });

  if (accessTokenData) {
    if (content && emoji) {
      await contentInfo.update({ content: content, emoji: emoji });

      res.status(200).json({ message: "일기 내용이 수정되었습니다" });
    } else if (emoji) {
      await contentInfo.update({ emoji: emoji });

      res.status(200).json({ message: "일기 내용이 수정되었습니다" });
    } else if (content) {
      await contentInfo.update({ content: content });

      res.status(200).json({ message: "일기 내용이 수정되었습니다" });
    }
  } else {
    res.status(500).json("err");
  }
};
