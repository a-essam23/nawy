import * as Joi from 'joi';

export interface IConfiguration {
  APP_URLS: string[];

  NODE_ENV: 'production' | 'development' | 'test';
  PORT: number;
  MONGO_URI: string;
  IMAGE_UPLOAD_API_KEY: string;
}
const commaSeparatedString = () =>
  Joi.string().custom((value, helpers) => {
    if (typeof value !== 'string') {
      return helpers.error('any.invalid');
    }

    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const { error } = Joi.array().items(Joi.string().min(1)).validate(items);
    if (error) {
      return helpers.error('any.invalid');
    }

    return items;
  }, 'split-comma-to-array');

export const configurationSchema = Joi.object<IConfiguration>({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
  APP_URLS: commaSeparatedString().required(),
  IMAGE_UPLOAD_API_KEY: Joi.string().required(),
});
