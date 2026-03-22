import Joi from 'joi';

export const registerSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email({ tlds: false }).trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
      'string.email': 'is invalid',
    }),
    username: Joi.string().trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
    password: Joi.string().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
    image: Joi.string().uri().allow('', null),
    bio: Joi.string().allow('', null),
    demo: Joi.boolean(),
  }).required(),
});

export const loginSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email({ tlds: false }).trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
      'string.email': 'is invalid',
    }),
    password: Joi.string().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
  }).required(),
});

export const updateSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email({ tlds: false }).trim().messages({
      'string.email': 'is invalid',
    }),
    username: Joi.string().trim(),
    password: Joi.string(),
    image: Joi.string().uri().allow('', null),
    bio: Joi.string().allow('', null),
  }).required(),
});
