const { Users } = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../tokenFunctions");

module.exports = (req, res) => {
  const { userId, password } = req.body;
  Users.findOne({
    where: {
      userId,
      password,
    },
  })
    .then((data) => {
      console.log(data);
      if (!data) {
        // return res.status(401).send({ data: null, message: 'not authorized' });
        return res.json({ data: null, message: "not authorized" });
      }
      delete data.dataValues.password;
      const accessToken = generateAccessToken(data.dataValues);
      const refreshToken = generateRefreshToken(data.dataValues);

      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, accessToken);
    })
    .catch((err) => {
      console.log(err);
    });
};
