const { user } = require("../../models");
const { isAuthorized } = require("../tokenFunctions");

module.exports = async (req, res) => {
  const { userId, nickname, password } = req.body;

  const userInfo = await user.findOne({ where: { userId } });

  if (password && userInfo) {
    userInfo.update({ password: password });

    res.status(200).json({ message: "개인정보가 변경 되었습니다" });
  } else if (nickname && userInfo) {
    userInfo.update({ nickname: nickname });
    console.log(userInfo);
    res.status(200).json({ message: "개인정보가 변경 되었습니다" });
  } else {
    res.status(400).json({ message: "양식에 맞는 정보를 입력해주세요" });
  }
};
