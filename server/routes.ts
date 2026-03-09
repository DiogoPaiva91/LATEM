import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertProductSchema, insertCustomerSchema, insertTeamMemberSchema, insertOrderSchema } from "@shared/schema";
import { seedDatabase } from "./seed";
import * as bling from "./bling";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  // === Categories ===
  app.get("/api/categories", async (_req, res) => {
    const cats = await storage.getCategories();
    res.json(cats);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const cat = await storage.getCategoryById(Number(req.params.id));
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  });

  app.post("/api/categories", async (req, res) => {
    const parsed = insertCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
    const cat = await storage.createCategory(parsed.data);
    res.status(201).json(cat);
  });

  app.put("/api/categories/:id", async (req, res) => {
    const cat = await storage.updateCategory(Number(req.params.id), req.body);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    await storage.deleteCategory(Number(req.params.id));
    res.status(204).send();
  });

  // === Products ===
  app.get("/api/products", async (_req, res) => {
    const prods = await storage.getProducts();
    res.json(prods);
  });

  app.get("/api/products/:id", async (req, res) => {
    const prod = await storage.getProductById(Number(req.params.id));
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  });

  app.post("/api/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
    const prod = await storage.createProduct(parsed.data);
    res.status(201).json(prod);
  });

  app.put("/api/products/:id", async (req, res) => {
    const prod = await storage.updateProduct(Number(req.params.id), req.body);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  });

  app.delete("/api/products/:id", async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // === Customers ===
  app.get("/api/customers", async (_req, res) => {
    const custs = await storage.getCustomers();
    res.json(custs);
  });

  app.get("/api/customers/:id", async (req, res) => {
    const cust = await storage.getCustomerById(Number(req.params.id));
    if (!cust) return res.status(404).json({ message: "Customer not found" });
    res.json(cust);
  });

  app.post("/api/customers", async (req, res) => {
    const parsed = insertCustomerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
    const cust = await storage.createCustomer(parsed.data);
    res.status(201).json(cust);
  });

  app.put("/api/customers/:id", async (req, res) => {
    const cust = await storage.updateCustomer(Number(req.params.id), req.body);
    if (!cust) return res.status(404).json({ message: "Customer not found" });
    res.json(cust);
  });

  app.delete("/api/customers/:id", async (req, res) => {
    await storage.deleteCustomer(Number(req.params.id));
    res.status(204).send();
  });

  // === Team Members ===
  app.get("/api/team-members", async (_req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  app.get("/api/team-members/:id", async (req, res) => {
    const member = await storage.getTeamMemberById(Number(req.params.id));
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  });

  app.post("/api/team-members", async (req, res) => {
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
    const member = await storage.createTeamMember(parsed.data);
    res.status(201).json(member);
  });

  app.put("/api/team-members/:id", async (req, res) => {
    const member = await storage.updateTeamMember(Number(req.params.id), req.body);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    await storage.deleteTeamMember(Number(req.params.id));
    res.status(204).send();
  });

  // === Orders ===
  app.get("/api/orders", async (_req, res) => {
    const ords = await storage.getOrders();
    res.json(ords);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrderById(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  app.post("/api/orders", async (req, res) => {
    const parsed = insertOrderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
    const order = await storage.createOrder(parsed.data);
    res.status(201).json(order);
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const order = await storage.updateOrderStatus(Number(req.params.id), status);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  // === Bling Integration ===
  app.get("/api/bling/auth-url", async (_req, res) => {
    try {
      const url = bling.getAuthorizationUrl();
      res.json({ url });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/bling/callback", async (req, res) => {
    try {
      console.log("Bling callback received:", JSON.stringify(req.query));

      const error = req.query.error as string;
      if (error) {
        const errorDesc = req.query.error_description as string || error;
        console.error("Bling OAuth error:", error, errorDesc);
        return res.redirect(`/admin?tab=integracoes&bling=error&error_msg=${encodeURIComponent(errorDesc)}`);
      }

      const code = req.query.code as string;
      const state = req.query.state as string;
      if (!code) {
        console.error("Bling callback: no code received. Query params:", JSON.stringify(req.query));
        return res.redirect("/admin?tab=integracoes&bling=error&error_msg=" + encodeURIComponent("Código de autorização não recebido do Bling"));
      }

      if (!state || !bling.validateOAuthState(state)) {
        console.error("Bling callback: invalid OAuth state. Expected state but got:", state);
        return res.redirect("/admin?tab=integracoes&bling=error&error_msg=" + encodeURIComponent("Estado OAuth inválido. Tente conectar novamente."));
      }

      const tokens = await bling.exchangeCode(code);
      const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
      await storage.saveBlingTokens(tokens.accessToken, tokens.refreshToken, expiresAt);

      console.log("Bling connected successfully, token expires at:", expiresAt.toISOString());
      res.redirect("/admin?tab=integracoes&bling=connected");
    } catch (err: any) {
      console.error("Bling callback error:", err);
      res.redirect(`/admin?tab=integracoes&bling=error&error_msg=${encodeURIComponent(err.message || "Erro desconhecido")}`);
    }
  });

  app.get("/api/bling/status", async (_req, res) => {
    const tokens = await storage.getBlingTokens();
    if (!tokens) return res.json({ connected: false });
    res.json({
      connected: true,
      expiresAt: tokens.expiresAt.toISOString(),
      createdAt: tokens.createdAt?.toISOString(),
    });
  });

  app.delete("/api/bling/disconnect", async (_req, res) => {
    await storage.deleteBlingTokens();
    res.json({ disconnected: true });
  });

  app.post("/api/bling/push-category/:id", async (req, res) => {
    try {
      const tokens = await storage.getBlingTokens();
      if (!tokens) return res.status(400).json({ message: "Bling não está conectado. Conecte sua conta Bling primeiro." });

      const categoryId = Number(req.params.id);
      const category = await storage.getCategoryById(categoryId);
      if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
      if (category.blingId) return res.status(400).json({ message: "Categoria já está sincronizada com o Bling" });

      let parentBlingId: string | undefined;
      if (category.parentId) {
        const parent = await storage.getCategoryById(category.parentId);
        if (!parent?.blingId) {
          return res.status(400).json({ message: "A categoria pai precisa estar sincronizada com o Bling primeiro" });
        }
        parentBlingId = parent.blingId;
      }

      const blingId = await bling.createCategoryInBling(category.name, parentBlingId);
      await storage.updateCategory(categoryId, { blingId });
      const updated = await storage.getCategoryById(categoryId);
      res.json(updated);
    } catch (err: any) {
      console.error("Bling push category error:", err);
      const status = err.name === "BlingPermissionError" ? 403 : 500;
      res.status(status).json({ message: err.message, permissionError: err.name === "BlingPermissionError" });
    }
  });

  app.post("/api/bling/push/categories", async (_req, res) => {
    try {
      const tokens = await storage.getBlingTokens();
      if (!tokens) return res.status(400).json({ message: "Bling não está conectado." });

      const result = await bling.pushAllCategoriesToBling();
      res.json(result);
    } catch (err: any) {
      console.error("Bling push all categories error:", err);
      const status = err.name === "BlingPermissionError" ? 403 : 500;
      res.status(status).json({ message: err.message, permissionError: err.name === "BlingPermissionError" });
    }
  });

  app.post("/api/bling/sync/categories", async (_req, res) => {
    try {
      const result = await bling.syncCategories();
      res.json(result);
    } catch (err: any) {
      console.error("Bling sync categories error:", err);
      const status = err.name === "BlingPermissionError" ? 403 : 500;
      res.status(status).json({ message: err.message, permissionError: err.name === "BlingPermissionError" });
    }
  });

  app.post("/api/bling/sync/products", async (_req, res) => {
    try {
      const result = await bling.syncProducts();
      res.json(result);
    } catch (err: any) {
      console.error("Bling sync products error:", err);
      const status = err.name === "BlingPermissionError" ? 403 : 500;
      res.status(status).json({ message: err.message, permissionError: err.name === "BlingPermissionError" });
    }
  });

  app.post("/api/bling/sync/all", async (_req, res) => {
    try {
      const result = await bling.syncAll();
      res.json(result);
    } catch (err: any) {
      console.error("Bling sync all error:", err);
      const status = err.name === "BlingPermissionError" ? 403 : 500;
      res.status(status).json({ message: err.message, permissionError: err.name === "BlingPermissionError" });
    }
  });

  return httpServer;
}
