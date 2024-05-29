import mongoose from "mongoose";
import { config } from "./config";

const dbConnect = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(config.mongoUri!);

    console.log(
      `MongoDB connected successfully host:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(
      "Something went wrong while connecting to the database",
      error
    );
    process.exit(1);
  }
};

export default dbConnect;
