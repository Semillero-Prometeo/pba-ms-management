import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AppConfiguration {
  environment: string;
  port: string;
  databaseUrl: string;
  natsServer: string;
  openaiApiKey: string;
  openaiSystemPrompt: string;
  openaiModel: string;
}

const configurations = registerAs(
  'configEnvs',
  (): AppConfiguration => ({
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    natsServer: process.env.NATS_SERVER,
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiSystemPrompt: process.env.OPENAI_SYSTEM_PROMPT,
    openaiModel: process.env.OPENAI_MODEL,
  }),
);

export function configRoot(): ConfigModuleOptions {
  return {
    load: [configurations],
    isGlobal: true,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().required(),
      DATABASE_URL: Joi.string().required(),
      NATS_SERVER: Joi.string().required(),
      OPENAI_API_KEY: Joi.string().required(),
      OPENAI_SYSTEM_PROMPT: Joi.string().required(),
      OPENAI_MODEL: Joi.string().required(),
    }),
  };
}

export default configurations;
