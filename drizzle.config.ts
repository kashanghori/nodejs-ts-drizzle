import { defineConfig } from "drizzle-kit";
import { env } from "./src/common/utils/envConfig";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
  },
  verbose: true,
  strict: true,
});
