/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as Joi from 'joi';

export interface IConfiguration {
  NODE_ENV: 'production' | 'development' | 'test';
  PORT: number;
  MONGO_URI: string;
}
export const configurationSchema = Joi.object<IConfiguration>({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
});
