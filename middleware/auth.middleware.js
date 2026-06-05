import {
  generateToken,
  verifyRefreshToken,
  verifyToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";

const verifyAuthToken = async (req, res, next) => {
  try {
    console.log("inside verifyAuthToken");
    const token = req.cookies.token;
    console.log(token, "inside verify Auth Token");

    // if (!token) {
    //   return res
    //     .status(400)
    //     .json({ message: "invalid credentials...token not found" });
    // }
    let user = null;
    if (token) {
      user = await verifyToken(token);
      console.log(user, "inside verify Auth Token");
    }

    if (user) {
      req.user = user;
      req.userId = user.id;
      return next();
    }
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, "inside verify Auth Token for refresh token");
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "invalid credentials...refresh token not found" });
    }
    const refreshUser = await verifyRefreshToken(refreshToken);
    console.log(refreshUser, "inside verify Auth Token for refresh token");
    if (!refreshUser) {
      return res
        .status(400)
        .json({ message: "invalid credentials...refresh token is invalid" });
    }
    const newAccessToken = await generateToken({
      id: refreshUser.id,
      role: refreshUser.role,
      phone_number: refreshUser.phone_number,
    });
    if (newAccessToken) {
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 10, // 10 minutes
      });
      logger.info("new Token generation successful");
    } else {
      logger.error("new Token generation failed");
      return res.status(400).json({ message: "new token generation failed" });
    }
    req.user = refreshUser;
    req.userId = refreshUser.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export { verifyAuthToken };
