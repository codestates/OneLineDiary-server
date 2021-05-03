const { isAuthorized } = require("../tokenFunctions");

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req);
  console.log(accessTokenData);

  const { userId } = accessTokenData;
};
