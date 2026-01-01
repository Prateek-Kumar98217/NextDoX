import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
});