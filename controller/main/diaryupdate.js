const { isAuthorized } = require("../tokenFunctions");
const { post, emoji } = require("../../models");
const refreshTokenRequest = require("../users/refreshTokenRequest");
const db = require("../../db/connection");
const con = require("../../db/connection");

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req);
  const { contentId, emojiId, changeContent, changeEmoji } = req.body;
  if (!accessTokenData) {
    refreshTokenRequest(req, res);
  }
  if (accessTokenData) {
    db.query("use test", (err) => {
      if (err) {
        return res.status(200).send("데이터베이스에 연결하지 못했습니다");
      }
      if (changeContent && changeEmoji) {
        console.log("change all");
        db.query(
          `update posts set content = '${changeContent}', updatedAt = now() where id = ${contentId}`
        );
        db.query(
          `update emojis set emoji = '${changeEmoji}', updatedAt = now() where id = ${emojiId}`
        );
        res.status(200).json({ message: "일기 내용이 수정되었습니다" });
      } else if (changeEmoji) {
        console.log("change emoji");
        db.query(
          `update emojis set emoji = '${changeEmoji}', updatedAt = now() where id = ${emojiId}`
        );
        res.status(200).json({ message: "일기 내용이 수정되었습니다" });
      } else if (changeContent) {
        console.log("change content");
        // UPDATE tablename SET filedA='456' WHERE test='123' LIMIT 10;
        db.query(
          `update posts set content = '${changeContent}', updatedAt = now() where id = ${contentId}`
        );
        res.status(200).json({ message: "일기 내용이 수정되었습니다" });
      }
    });
  }
};

//       const contentInfo = await post.findOne({ where: { id: contentId } });
//       const emojiInfo = await emoji.findOne({ where: { id: emojiId } });
//       await contentInfo.update({
//         content: changeContent,
//         updatedAt: new Date(),
//       });
//       await emojiInfo.update({ emoji: changeEmoji, updatedAt: new Date() });
//       res.status(200).json({ message: "일기 내용이 수정되었습니다" });
//     } else if (changeEmoji) {
//       const emojiInfo = await emoji.findOne({ where: { id: emojiId } });
//       await emojiInfo.update({ emoji: changeEmoji, updatedAt: new Date() });

//       res.status(200).json({ message: "일기 내용이 수정되었습니다" });
//     } else if (changeContent) {
//       const contentInfo = await post.findOne({ where: { id: contentId } });
//       await contentInfo.update({
//         content: changeContent,
//         updatedAt: new Date(),
//       });

//       res.status(200).json({ message: "일기 내용이 수정되었습니다" });
//     }
//   } else {
//     res.status(500).json("err");
//   }
// }
