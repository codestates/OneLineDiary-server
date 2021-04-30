const { Users } = require("../../models");

module.exports = {
  get: async (req, res) => {
    console.log(req.body);
    // const userInfo = await Users.findOne({
    //   where: { id: req.body.userId, password: req.body.password },
    // });

    // console.log(userInfo);
  },
};
