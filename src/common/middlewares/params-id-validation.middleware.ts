import { param } from "express-validator";

export const paramsIdValidationMiddleware = param("id")
  .exists()
  .withMessage("Id is required")
  .isString()
  .withMessage("Id must be a string")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");
