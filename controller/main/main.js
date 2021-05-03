const { user, post, post_info, emoji } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    return res.json({ data: null, message: "invalid access token" });
  }
  //   console.log(accessTokenData);
  const { userId } = accessTokenData;
  user
    //조인하는법?
    .findAll({
      include: [
        {
          model: post,
          attributes: ["content", "createdAt", "updatedAt"],
          where: { userId: userId },
          include: [
            {
              model: post_info,
              include: [
                {
                  model: emoji,
                  attributes: ["emoji"],
                },
              ],
            },
          ],
        },
      ],
    })
    .then((data) => {
      // 1. 로그인한 사용자 별로 db 불러오기
      // 2. 새로운 아이디로 로그인 해서 컴포넌트들이 정상작동 하는지 확인
      const contentData = data[0].dataValues.posts.map(
        (el) => el.dataValues.content
      );
      const emojiData = data[0].dataValues.posts.map(
        (el) => el.dataValues.post_infos[0].dataValues.emoji.dataValues.emoji
      );
      const createdAtData = data[0].dataValues.posts.map(
        (el) => el.dataValues.createdAt
      );
      const updatedAtData = data[0].dataValues.posts.map(
        (el) => el.dataValues.updatedAt
      );
      let returnArr = [];

      for (let i = contentData.length - 1; i > -1; i--) {
        returnArr.push({
          nickname: data[0].dataValues.nickname,
          content: [
            {
              content: contentData[i],
              emoji: emojiData[i],
              created_At: createdAtData[i],
              updated_At: updatedAtData[i],
            },
          ],
        });
      }
      if (!data) {
        // return res.status(401).send({ data: null, message: 'not authorized' });
        return res.json({
          data: null,
          message: "access token has been tempered",
        });
      }
      return res.json(returnArr);
    })
    .catch((err) => {
      console.log(err);
    });
};
