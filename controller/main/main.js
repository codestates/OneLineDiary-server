// const { user, post, post_info, emoji } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");
const refreshTokenRequest = require("../users/refreshTokenRequest");
const db = require("../../db/connection");

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    refreshTokenRequest(req, res);
  }
  console.log("accessToken data: ", accessTokenData.userId);
  db.query("use test", (err) => {
    if (err) {
      return res.status(200).send("데이터베이스에 연결하지 못했습니다");
    }
    // console.log(req.body.userId);
    db.query(
      `select * from users join posts on users.userId = posts.userId join post_infos on posts.id = post_infos.post_id join emojis on post_infos.emoji_id = emojis.id where users.userId = '${accessTokenData.userId}'`,
      (err, data) => {
        if (err) {
          return res.status(401).json({ message: "일치하는 정보가 없습니다" });
        }
        if (data.length === 0) {
          // return res.status(401).send({ data: null, message: 'not authorized' });
          return res.status(400).json({ message: "일치하는 정보가 없습니다" });
        }
        console.log(data);
        if (!data) {
          // return res.status(401).send({ data: null, message: 'not authorized' });
          return res.json({
            data: null,
            message: "access token has been tempered",
          });
        }
        return res.json(data);
      }
    );
  });
  // const { userId } = accessTokenData;
  // user
  //   //조인하는법?
  //   .findAll({
  //     include: [
  //       {
  //         model: post,
  //         attributes: ["content", "createdAt", "updatedAt"],
  //         where: { userId: userId },
  //         include: [
  //           {
  //             model: post_info,
  //             include: [
  //               {
  //                 model: emoji,
  //                 attributes: ["emoji"],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   })
  //   .then((data) => {
  //     // 1. 로그인한 사용자 별로 db 불러오기
  //     // 2. 새로운 아이디로 로그인 해서 컴포넌트들이 정상작동 하는지 확인
  //     const contentData = data[0].dataValues.posts.map(
  //       (el) => el.dataValues.content
  //     );
  //     const emojiData = data[0].dataValues.posts.map(
  //       (el) => el.dataValues.post_infos[0].dataValues.emoji.dataValues.emoji
  //     );
  //     const createdAtData = data[0].dataValues.posts.map(
  //       (el) => el.dataValues.createdAt
  //     );
  //     const updatedAtData = data[0].dataValues.posts.map(
  //       (el) => el.dataValues.updatedAt
  //     );
  //     let returnArr = [];

  //     for (let i = contentData.length - 1; i > -1; i--) {
  //       returnArr.push({
  //         nickname: data[0].dataValues.nickname,
  //         content: [
  //           {
  //             content: contentData[i],
  //             emoji: emojiData[i],
  //             created_At: createdAtData[i],
  //             updated_At: updatedAtData[i],
  //           },
  //         ],
  //       });
  //     }
  //     if (!data) {
  //       // return res.status(401).send({ data: null, message: 'not authorized' });
  //       return res.json({
  //         data: null,
  //         message: "access token has been tempered",
  //       });
  //     }
  //     return res.json(returnArr);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
