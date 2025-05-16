import { registerAs } from '@nestjs/config';
import { IConfiguration } from './configuration.schema';

export default registerAs(
  'config',
  (): IConfiguration => ({
    MONGO_URI: process.env.MONGO_URI!,
    PORT: parseInt(process.env.PORT || '3100', 10),
    NODE_ENV:
      (process.env.NODE_ENV as IConfiguration['NODE_ENV']) || 'development',
  }),
);
