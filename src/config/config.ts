import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || "development",
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiry: process.env.TOKEN_EXPIRY,
};

export const config = Object.freeze(_config);
