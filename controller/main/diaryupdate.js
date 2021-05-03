const { isAuthorized } = require("../tokenFunctions");
const { post, emoji } = require("../../models");

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req);
  const { contentId, emojiId, changeContent, changeEmoji } = req.body;

  if (accessTokenData) {
    if (changeContent && changeEmoji) {
      const contentInfo = await post.findOne({ where: { id: contentId } });
      const emojiInfo = await emoji.findOne({ where: { id: emojiId } });
      await contentInfo.update({ content: changeContent });
      await emojiInfo.update({ emoji: changeEmoji });
      res.status(200).json({ message: "일기 내용이 수정되었습니다" });
    } else if (changeEmoji) {
      const emojiInfo = await emoji.findOne({ where: { id: emojiId } });
      await emojiInfo.update({ emoji: changeEmoji });

      res.status(200).json({ message: "일기 내용이 수정되었습니다" });
    } else if (changeContent) {
      const contentInfo = await post.findOne({ where: { id: contentId } });
      await contentInfo.update({ content: changeContent });

      res.status(200).json({ message: "일기 내용이 수정되었습니다" });
    }
  } else {
    res.status(500).json("err");
  }
};
