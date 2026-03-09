import {
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Customer, type InsertCustomer,
  type TeamMember, type InsertTeamMember,
  type Order, type InsertOrder,
  type BlingToken,
  users, categories, products, customers, teamMembers, orders, blingTokens
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<void>;

  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<void>;

  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  getBlingTokens(): Promise<BlingToken | null>;
  saveBlingTokens(accessToken: string, refreshToken: string, expiresAt: Date): Promise<void>;
  deleteBlingTokens(): Promise<void>;
  getCategoryByBlingId(blingId: string): Promise<Category | undefined>;
  upsertCategoryByBlingId(blingId: string, data: Partial<InsertCategory>): Promise<Category>;
  upsertProductByBlingId(blingId: string, data: Partial<InsertProduct>): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.id));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getCustomers(): Promise<Customer[]> {
    return db.select().from(customers).orderBy(desc(customers.id));
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [created] = await db.insert(customers).values(customer).returning();
    return created;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updated] = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return updated;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers).orderBy(desc(teamMembers.id));
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [updated] = await db.update(teamMembers).set(member).where(eq(teamMembers.id, id)).returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getBlingTokens(): Promise<BlingToken | null> {
    const [token] = await db.select().from(blingTokens).orderBy(desc(blingTokens.id)).limit(1);
    return token || null;
  }

  async saveBlingTokens(accessToken: string, refreshToken: string, expiresAt: Date): Promise<void> {
    await db.delete(blingTokens);
    await db.insert(blingTokens).values({ accessToken, refreshToken, expiresAt });
  }

  async deleteBlingTokens(): Promise<void> {
    await db.delete(blingTokens);
  }

  async getCategoryByBlingId(blingId: string): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.blingId, blingId));
    return cat;
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(sql`lower(${categories.name}) = lower(${name})`);
    return cat;
  }

  async upsertCategoryByBlingId(blingId: string, data: Partial<InsertCategory>): Promise<Category> {
    const existingByBling = await this.getCategoryByBlingId(blingId);
    if (existingByBling) {
      const [updated] = await db.update(categories).set(data).where(eq(categories.id, existingByBling.id)).returning();
      return updated;
    }

    if (data.name) {
      const existingByName = await this.getCategoryByName(data.name);
      if (existingByName) {
        const updateData = { ...data, blingId };
        delete updateData.slug;
        const [updated] = await db.update(categories).set(updateData).where(eq(categories.id, existingByName.id)).returning();
        return updated;
      }
    }

    const [created] = await db.insert(categories).values({ ...data, blingId, name: data.name || "Sem nome", slug: data.slug || `bling-${blingId}`, status: data.status || "Ativa" }).returning();
    return created;
  }

  async upsertProductByBlingId(blingId: string, data: Partial<InsertProduct>): Promise<Product> {
    const [existing] = await db.select().from(products).where(eq(products.blingId, blingId));
    if (existing) {
      const [updated] = await db.update(products).set(data).where(eq(products.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(products).values({ ...data, blingId, name: data.name || "Sem nome", sku: data.sku || `BLING-${blingId}`, price: data.price || 0, status: data.status || "Ativo" }).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
