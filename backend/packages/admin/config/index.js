const dotEnv = require("dotenv");

if (process.env.NODE_ENV) {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  console.log("====================================");
  console.log(configFile);
  console.log("====================================");
  dotEnv.config({ path: configFile });

}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
};
