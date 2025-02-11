import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || "development",
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiry: process.env.TOKEN_EXPIRY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
