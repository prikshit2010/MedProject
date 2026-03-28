import { pgTable, text, integer, timestamp, json, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Matches Clerk's userId
  name: text("name").notNull(),
  email: text("email").notNull(),
  credits: integer("credits").notNull().default(1),
  age: integer("age"),
  weight: integer("weight"), // in kg
  height: integer("height"), // in cm
  address: text("address"),
  contactNo: text("contact_no"),
});

export const sessionHistory = pgTable("session_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  doctorId: text("doctor_id").notNull(),
  symptoms: text("symptoms").notNull(),
  consultationDate: timestamp("consultation_date").notNull().defaultNow(),
  generatedReport: json("generated_report"),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessionHistory),
}));

export const sessionHistoryRelations = relations(sessionHistory, ({ one }) => ({
  user: one(users, {
    fields: [sessionHistory.userId],
    references: [users.id],
  }),
}));
