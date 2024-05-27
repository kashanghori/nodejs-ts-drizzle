import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const UserToken = pgTable("token", {
  id: uuid("id").primaryKey().defaultRandom(),
  accessToken: varchar("accessToken"),
  refreshToken: varchar("accessToken"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  expiresAt: timestamp("expiresAt").notNull(),
  userId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
});
