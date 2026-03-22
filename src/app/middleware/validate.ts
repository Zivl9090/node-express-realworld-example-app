import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (!error) {
    req.body = value;
    return next();
  }

  const errors: Record<string, string[]> = {};
  error.details.forEach(({ path, message }) => {
    const field = path[path.length - 1] as string;
    errors[field] = errors[field] || [];
    errors[field].push(message);
  });

  return res.status(422).json({ errors });
};

export default validate;
