import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || "development",
};

export const config = Object.freeze(_config);
