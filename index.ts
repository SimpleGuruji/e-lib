import app from "./src/app";
import { config } from "./src/config/config";
import dbConnect from "./src/config/db";

dbConnect()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error(
      `Error: ${err}. Please check your database connection settings in the config/db.js file!`
    );
  });
