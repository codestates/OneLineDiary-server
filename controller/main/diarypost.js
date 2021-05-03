const { user, post, post_info, emoji } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");
const refreshTokenRequest = require("../users/refreshTokenRequest");
const db = require("../../db/connection");

module.exports = async (req, res) => {
  //db에 저장하고 메세지를 보낸다.
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // return res.status(401).send("no token in req.headers['authorization']");
    refreshTokenRequest(req, res);
  }
  //   console.log(accessTokenData);
  const { userId } = accessTokenData;
  // console.log(accessTokenData, req.body.content, req.body.emoji);
  // updatedAt: createdAt > 최초 생성될 때는 업데이트 시간과 최초생성시간이 같다
  // createdAt, updatedAt은 req 값으로 받지 않아도 될거같다. 자동으로 db에 추가된다.
  // 같은 내용은 여러번 입력할 수도 있으니 db를 검색안해도 될거 같음
  // 조건으로 특정아이디 데이터만 갖고오게
  db.query("use test", (err) => {
    if (err) {
      return res.status(200).send("데이터베이스에 연결하지 못했습니다");
    }
    db.query(
      `insert into posts(userId, content, createdAt, updatedAt) values('${userId}','${req.body.content}',now(),now())`
    );
    db.query(
      `insert into emojis(emoji, createdAt, updatedAt) values('${req.body.emoji}',now(),now())`
    );
    db.query(`select id from posts order by id desc limit 1`, (err, result) => {
      console.log(result[0].id);
      const postId = result[0].id;
      db.query(
        `select id from emojis order by id desc limit 1`,
        (err, result) => {
          console.log(result[0].id);
          const emojiId = result[0].id;
          db.query(
            `insert into post_infos(post_id, emoji_id) values('${postId}','${emojiId}')`
          );
        }
      );
    });
  });
  const message = { message: "오늘의 일기가 등록되었습니다" };
  res.status(200).send(message);
  // post
  //   .create({
  //     userId: userId,
  //     content: req.body.content,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   })
  //   .then(() => {
  //     emoji
  //       .create({
  //         emoji: req.body.emoji,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       })
  //       .then(async () => {
  //         const postInfo = await post.findOne({ order: [["id", "DESC"]] });
  //         const emojiInfo = await emoji.findOne({ order: [["id", "DESC"]] });
  //         // console.log(postInfo.dataValues.id, "---", emojiInfo.dataValues.id);
  //         post_info.create({
  //           post_id: postInfo.dataValues.id,
  //           // 수정이 필요하다. req에 받아오는 새로운 값이 필요할 것 같음
  //           emoji_id: emojiInfo.dataValues.id,
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });
  // const message = { message: "오늘의 일기가 등록되었습니다" };
  // res.status(200).send(message);
};
