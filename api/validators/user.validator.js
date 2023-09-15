const Joi = require("joi");

const addUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.string().min(1).max(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().length(11).required(),
  address: Joi.string(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
  systemRoles: Joi.array()
    .items({
      role: Joi.string().valid("DOCTOR", "CLINICAL STAFF", "ADMIN").required(),
      shift: Joi.string().valid("MORNING", "EVENING").required(),
      department: Joi.string()
        .valid("PSYCHOLOGY", "REGULAR", "HEART")
        .required(),
    })
    .required(),
});

module.exports = {
  addUserSchema,
};
