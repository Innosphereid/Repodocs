import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
}));

export const supabaseConfig = registerAs('supabase', () => ({
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}));

export const githubConfig = registerAs('github', () => ({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
}));

export const aiConfig = registerAs('ai', () => ({
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
}));

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
}));

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
}));

export const rateLimitConfig = registerAs('rateLimit', () => ({
  // Document generation limits (monthly)
  documentGeneration: {
    anonymous: parseInt(process.env.DOC_GEN_LIMIT_ANONYMOUS, 10) || 3,
    free: parseInt(process.env.DOC_GEN_LIMIT_FREE, 10) || 10,
    pro: parseInt(process.env.DOC_GEN_LIMIT_PRO, 10) || 100,
    team: process.env.DOC_GEN_LIMIT_TEAM || 'unlimited',
  },

  // Login attempt limits (per minute)
  loginAttempt: {
    maxAttempts: parseInt(process.env.LOGIN_MAX_ATTEMPTS, 10) || 5,
    windowMs: parseInt(process.env.LOGIN_WINDOW_MS, 10) || 60000, // 1 minute
  },

  // General API rate limiting
  api: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
}));

export const validationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().port().optional(),
  DB_USERNAME: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  DB_NAME: Joi.string().optional(),

  // Supabase
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),

  // GitHub
  GITHUB_CLIENT_ID: Joi.string().optional(),
  GITHUB_CLIENT_SECRET: Joi.string().optional(),
  GITHUB_APP_ID: Joi.string().optional(),
  GITHUB_PRIVATE_KEY: Joi.string().optional(),
  GITHUB_WEBHOOK_SECRET: Joi.string().optional(),

  // AI Services
  OPENAI_API_KEY: Joi.string().optional(),
  ANTHROPIC_API_KEY: Joi.string().optional(),

  // Redis
  REDIS_URL: Joi.string().uri().optional(),
  REDIS_HOST: Joi.string().optional(),
  REDIS_PORT: Joi.number().port().optional(),
  REDIS_PASSWORD: Joi.string().optional(),

  // App Config
  NODE_ENV: Joi.string().valid('development', 'production', 'test').optional(),
  PORT: Joi.number().port().optional(),
  JWT_SECRET: Joi.string().optional(),
  SESSION_SECRET: Joi.string().optional(),
  CORS_ORIGIN: Joi.string().uri().optional(),
  BACKEND_URL: Joi.string().uri().optional(),

  // Rate Limiting - Document Generation
  DOC_GEN_LIMIT_ANONYMOUS: Joi.number().positive().optional(),
  DOC_GEN_LIMIT_FREE: Joi.number().positive().optional(),
  DOC_GEN_LIMIT_PRO: Joi.number().positive().optional(),
  DOC_GEN_LIMIT_TEAM: Joi.string().valid('unlimited').optional(),

  // Rate Limiting - Login Attempts
  LOGIN_MAX_ATTEMPTS: Joi.number().positive().optional(),
  LOGIN_WINDOW_MS: Joi.number().positive().optional(),

  // Rate Limiting - API
  API_RATE_LIMIT_WINDOW_MS: Joi.number().positive().optional(),
  API_RATE_LIMIT_MAX_REQUESTS: Joi.number().positive().optional(),
});
