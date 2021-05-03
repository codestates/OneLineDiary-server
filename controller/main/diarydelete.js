// const { isAuthorized } = require("../tokenFunctions");
// const { post } = require("../../models");

// module.exports = async (req, res) => {
//   const accessTokenData = isAuthorized(req);

//   if (accessTokenData) {
//     await post.destroy({
//       where: {
//         content: accessTokenData.content,
//         emoji: accessTokenData.emoji,
//         post_id: accessTokenData.post_id,
//       },
//     });
//     res.status(200).json({ message: "일기내용이 삭제 되었습니다" });
//   } else {
//     res.status(500).json("err");
//   }
// };
