import { ObjectId } from "mongodb";
import { mdb } from "../util/db.util.js";

const isUserExists = async (_id, role) => {
  const existingUser = await mdb
    .collection(`${role}s`)
    .findOne({ _id: new ObjectId(_id) });

  if (!existingUser) {
    throw new Error("user not found");
  }
  return existingUser;
};

export { isUserExists };
