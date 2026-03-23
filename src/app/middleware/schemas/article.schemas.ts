import Joi from 'joi';

export const createArticleSchema = Joi.object({
  article: Joi.object({
    title: Joi.string().trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
    description: Joi.string().trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
    body: Joi.string().trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
    tagList: Joi.array().items(Joi.string()).default([]),
  }).required(),
});

export const updateArticleSchema = Joi.object({
  article: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    body: Joi.string().trim(),
    tagList: Joi.array().items(Joi.string()),
  }).min(1).required(),
});

export const addCommentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().trim().required().messages({
      'string.empty': "can't be blank",
      'any.required': "can't be blank",
    }),
  }).required(),
});
