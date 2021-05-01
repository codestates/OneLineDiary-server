const { isAuthorized } = require("../tokenFunctions");

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req);

  if (req.headers["authorization"] && accessTokenData.userId) {
    delete req.headers["authorization"];
    res.status(200).json({ message: "정상적으로 로그아웃 되었습니다" });
  } else {
    res.status(400).json({ message: "토큰이 만료되었습니다" });
  }
};
