import Joi from "joi";

const productSchema = Joi.object({
  product_name: Joi.string().required().min(3).max(50),
  price: Joi.number().required().positive(),
});

export { productSchema };
