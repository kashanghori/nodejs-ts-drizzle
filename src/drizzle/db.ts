import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres';
import * as schema from "./schema";
import { env } from '@/common/utils/envConfig';

const client = postgres({
     user: env.DB_USER,
     password: env.DB_PASS,
     database: env.DB_NAME,
     host: env.DB_HOST,
     port: env.DB_PORT,
})
export const db = drizzle(client, { schema , logger: true})