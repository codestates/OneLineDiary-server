require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "60m" });
    //임시로 만료시간 60분 설정 짧게 설정해야한다.
  },
  generateRefreshToken: (data) => {
    return sign(data, process.env.REFRESH_SECRET, { expiresIn: "30d" });
  },
  sendRefreshToken: (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
  },
  // 처음 로그인 할 때
  sendAccessToken: (res, accessToken, data) => {
    // { accessToken: accessToken , message: "ok", userInfo:{id:userId, nickname:nickname} }
    // console.log(data.dataValues.nickname);
    // console.log(data);
    res.json({
      accessToken: accessToken,
      message: "ok",
      userInfo: {
        id: data.userId,
        nickname: data.nickname,
      },
    });
  },
  isAuthorized: (req) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return null;
    }
    const token = authorization.split(" ")[1];
    try {
      return verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      // return null if invalid token
      return null;
    }
  },
  checkRefeshToken: (refreshToken) => {
    try {
      return verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      // return null if refresh token is not valid
      return null;
    }
  },
};
