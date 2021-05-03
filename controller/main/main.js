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
      console.log("nickname:", data[0].dataValues.nickname);
      console.log(
        "content:",
        data[0].dataValues.posts.map((el) => el.dataValues.content)
      );
      console.log(
        "emoji:",
        data[0].dataValues.posts.map((el) => el.dataValues.post_infos[0])
      );
      if (!data) {
        // return res.status(401).send({ data: null, message: 'not authorized' });
        return res.json({
          data: null,
          message: "access token has been tempered",
        });
      }
      return res.json({
        nickname: data[0].dataValues.nickname,
        content: [
          {
            content: data[0].posts[0].dataValues.content,
            emoji:
              data[0].dataValues.posts[1].post_infos[0].emoji.dataValues.emoji,
            created_At: data[0].dataValues.posts[1].dataValues.createdAt,
            updated_At: data[0].dataValues.posts[1].dataValues.updatedAt,
          },
        ],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
