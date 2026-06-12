import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import logger from "../service/log.service.js";
import { connectMongo, mdb } from "./db.util.js";

const createRoles = async () => {
  try {
    await connectMongo();
    console.log("roles creation started ");
    const response = await mdb.collection(COLLECTION.ROLE).insertMany([
      {
        roleName: "admin",
      },
      {
        roleName: "vendor",
      },
      {
        roleName: "customer",
      },
    ]);
    logger.info(`roles collection created ${JSON.stringify(response)}`);

    console.log(`roles collection created ${JSON.stringify(response)}`);
  } catch (error) {
    logger.error(`error inside createRoles ${error}`);
  }
};

export { createRoles };
