import {
  generateToken,
  verifyRefreshToken,
  verifyToken,
} from "../service/auth.service.js";
import logger from "../service/log.service.js";
import { ACCESS_TOKEN_NAME } from "../Constants/authToken.constant.js";

const verifyAuthToken = async (req, res, next) => {
  try {
    console.log("inside verifyAuthToken");
    const token = req.cookies[ACCESS_TOKEN_NAME];
    console.log(token, "inside verify Auth Token");

    let user = null;
    if (!token) {
      logger.error(" Access token not found ");
      return res.status(401).json({ message: " Access token not found " });
    }

    user = await verifyToken(token);

    if (!user) {
      logger.error("Access token verification failed");
      return res
        .status(401)
        .json({ message: "Access token verification failed" });
    }

    if (user) {
      req.user = user;
      req.userId = user._id;
      return next();
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export { verifyAuthToken };
