import Joi from "@hapi/joi";
import { Permissions } from "../types";

export const signUpPayload = Joi.object().keys({
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2 })
    .label("email")
    .required(),
  username: Joi.string().trim().label("username").required(),
  password: Joi.string().trim().label("password").min(6).required(),
});

export const signInPayload = Joi.object().keys({
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2 })
    .label("email")
    .required(),
  password: Joi.string().trim().label("password").required(),
});

export const addImagePayload = Joi.object().keys({
  permission: Joi.string().valid(Permissions.PRIVATE, Permissions.PUBLIC),
});
