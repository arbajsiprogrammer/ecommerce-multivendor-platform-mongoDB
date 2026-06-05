import joi from "joi";

const authSchema = joi.object({
  phoneNumber: joi.string().required().max(15).min(10),
  password: joi.string().required().min(6).max(20),
  firstName: joi.string().required().max(50).min(2),
  lastName: joi.string().required().max(50).min(2),
  role: joi.string().required().valid("customer", "vendor", "admin"),
});

export default authSchema;
