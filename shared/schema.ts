import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").default("📦"),
  color: text("color").default("#666666"),
  image: text("image"),
  parentId: integer("parent_id"),
  productCount: integer("product_count").default(0),
  status: text("status").default("Ativa").notNull(),
  sortOrder: integer("sort_order").default(0),
  blingId: text("bling_id"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  categoryId: integer("category_id"),
  subcategoryId: integer("subcategory_id"),
  description: text("description").default(""),
  price: integer("price").notNull(),
  image: text("image").default(""),
  packageType: text("package_type").default("Unidade"),
  stock: integer("stock").default(0),
  minStock: integer("min_stock").default(10),
  status: text("status").default("Ativo").notNull(),
  specs: jsonb("specs").$type<Record<string, string>>(),
  blingId: text("bling_id"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnpj: text("cnpj").notNull(),
  email: text("email").notNull(),
  segment: text("segment").default("Varejo"),
  status: text("status").default("Ativo").notNull(),
  phone: text("phone"),
  address: text("address"),
  lastOrderAmount: text("last_order_amount").default("R$ 0,00"),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  whatsapp: text("whatsapp").default(""),
  status: text("status").default("Ativo").notNull(),
  admissionDate: text("admission_date"),
  lastAccess: text("last_access"),
  avatar: text("avatar"),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  items: jsonb("items").$type<Array<{ productId: number; name: string; price: number; quantity: number }>>().notNull(),
  total: integer("total").notNull(),
  status: text("status").default("Pendente").notNull(),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blingTokens = pgTable("bling_tokens", {
  id: serial("id").primaryKey(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type BlingToken = typeof blingTokens.$inferSelect;
