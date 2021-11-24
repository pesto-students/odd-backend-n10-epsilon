import dotEnv from "dotenv";

if (process.env.NODE_ENV) {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
}

const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
