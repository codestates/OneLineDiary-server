const { isAuthorized } = require("../tokenFunctions");
const { post, post_info, emoji } = require("../../models");

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    return res.json({ data: null, message: "invalid access token" });
  }
  //req 의 contentId 값을 추적해서 지운다.
  else if (accessTokenData) {
    //이모지 아이디 구하기!
    const emojiIdInfo = await post_info.findOne({
      where: { post_id: req.body.contentId },
    });
    // 포스트 테이블 정보 삭제
    post.destroy({
      where: { id: req.body.contentId, userId: req.body.userId },
    });
    //이모지 테이블 정보 삭제
    emoji.destroy({ where: { id: emojiIdInfo.dataValues.emoji_id } });
    //post_info테이블 정보 삭제
    post_info.destroy({
      where: {
        post_id: req.body.contentId,
        emoji_id: emojiIdInfo.dataValues.emoji_id,
      },
    });
    const message = { message: "일기 내용이 삭제되었습니다." };
    res.status(200).send(message);
  } else {
    res.status(500).json("err");
  }
};
