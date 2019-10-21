import { Tedis } from 'tedis';

import { ConfigService } from '../config/config.service';

const envFile = `${process.env.NODE_ENV || 'development'}.env`;
const configService = new ConfigService(envFile);
const host = configService.get('REDIS_HOST');
const pass = configService.get('REDIS_PASS');

export const tedis = new Tedis({
  port: 6379,
  host: host,
  password: pass,
});
