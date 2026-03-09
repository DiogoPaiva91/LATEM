import { storage } from "./storage";
import crypto from "crypto";

const BLING_BASE_URL = "https://www.bling.com.br/Api/v3";
const BLING_AUTH_URL = "https://www.bling.com.br/Api/v3/oauth/authorize";
const BLING_TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";

let pendingOAuthState: string | null = null;

function getRedirectUri(): string {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (domain) {
    return `https://${domain}/api/bling/callback`;
  }
  return `http://localhost:5000/api/bling/callback`;
}

export function getAuthorizationUrl(): string {
  const clientId = process.env.BLING_CLIENT_ID;
  if (!clientId) throw new Error("BLING_CLIENT_ID not configured");

  const state = crypto.randomBytes(16).toString("hex");
  pendingOAuthState = state;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    state,
  });

  return `${BLING_AUTH_URL}?${params.toString()}`;
}

export function validateOAuthState(state: string): boolean {
  if (!pendingOAuthState || state !== pendingOAuthState) {
    return false;
  }
  pendingOAuthState = null;
  return true;
}

export async function exchangeCode(code: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const clientId = process.env.BLING_CLIENT_ID;
  const clientSecret = process.env.BLING_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Bling credentials not configured");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
  });

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(BLING_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to exchange code: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const clientId = process.env.BLING_CLIENT_ID;
  const clientSecret = process.env.BLING_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Bling credentials not configured");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(BLING_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to refresh token: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600,
  };
}

async function getValidToken(): Promise<string> {
  const tokens = await storage.getBlingTokens();
  if (!tokens) throw new Error("Bling not connected");

  const now = new Date();
  const bufferMs = 5 * 60 * 1000;

  if (tokens.expiresAt.getTime() - bufferMs > now.getTime()) {
    return tokens.accessToken;
  }

  const refreshed = await refreshAccessToken(tokens.refreshToken);
  const expiresAt = new Date(Date.now() + refreshed.expiresIn * 1000);
  await storage.saveBlingTokens(refreshed.accessToken, refreshed.refreshToken, expiresAt);
  return refreshed.accessToken;
}

let requestQueue: Promise<void> = Promise.resolve();

function enqueueRequest(): Promise<void> {
  return new Promise<void>((resolve) => {
    requestQueue = requestQueue.then(async () => {
      await new Promise(r => setTimeout(r, 600));
      resolve();
    });
  });
}

async function blingGet(path: string, params?: Record<string, string>, retries = 3, tokenRetried = false): Promise<any> {
  await enqueueRequest();

  const token = await getValidToken();
  const url = new URL(`${BLING_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 429 && retries > 0) {
    const waitTime = 3000 * (4 - retries);
    console.log(`Bling rate limit hit on ${path}, waiting ${waitTime}ms before retry (${retries} retries left)`);
    await new Promise(r => setTimeout(r, waitTime));
    return blingGet(path, params, retries - 1, tokenRetried);
  }

  if (res.status === 401 && !tokenRetried) {
    console.log(`Bling token invalid on ${path}, attempting refresh...`);
    try {
      const tokens = await storage.getBlingTokens();
      if (tokens) {
        const refreshed = await refreshAccessToken(tokens.refreshToken);
        const expiresAt = new Date(Date.now() + refreshed.expiresIn * 1000);
        await storage.saveBlingTokens(refreshed.accessToken, refreshed.refreshToken, expiresAt);
        console.log("Bling token refreshed successfully");
        return blingGet(path, params, retries, true);
      }
    } catch (refreshErr: any) {
      console.error("Bling token refresh failed:", refreshErr.message);
      await storage.deleteBlingTokens();
      throw new Error("Token do Bling expirou e não foi possível renovar. Reconecte sua conta Bling.");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new BlingPermissionError(`Sem permissão para acessar ${path}. Verifique as permissões do seu usuário/plano no Bling.`);
    }
    throw new Error(`Bling API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function blingPost(path: string, body: any, retries = 3, tokenRetried = false): Promise<any> {
  await enqueueRequest();

  const token = await getValidToken();
  const url = `${BLING_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429 && retries > 0) {
    const waitTime = 3000 * (4 - retries);
    console.log(`Bling rate limit hit on POST ${path}, waiting ${waitTime}ms before retry (${retries} retries left)`);
    await new Promise(r => setTimeout(r, waitTime));
    return blingPost(path, body, retries - 1, tokenRetried);
  }

  if (res.status === 401 && !tokenRetried) {
    console.log(`Bling token invalid on POST ${path}, attempting refresh...`);
    try {
      const tokens = await storage.getBlingTokens();
      if (tokens) {
        const refreshed = await refreshAccessToken(tokens.refreshToken);
        const expiresAt = new Date(Date.now() + refreshed.expiresIn * 1000);
        await storage.saveBlingTokens(refreshed.accessToken, refreshed.refreshToken, expiresAt);
        console.log("Bling token refreshed successfully");
        return blingPost(path, body, retries, true);
      }
    } catch (refreshErr: any) {
      console.error("Bling token refresh failed:", refreshErr.message);
      await storage.deleteBlingTokens();
      throw new Error("Token do Bling expirou e não foi possível renovar. Reconecte sua conta Bling.");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new BlingPermissionError(`Sem permissão para acessar ${path}. Verifique as permissões do seu usuário/plano no Bling.`);
    }
    throw new Error(`Bling API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function createCategoryInBling(name: string, parentBlingId?: string): Promise<string> {
  const body: any = { descricao: name };
  if (parentBlingId) {
    body.categoriaPai = { id: Number(parentBlingId) };
  }
  const result = await blingPost("/categorias/produtos", body);
  const blingId = result?.data?.id || (Array.isArray(result?.data) && result.data[0]?.id);
  if (!blingId) {
    console.error("Bling create category response:", JSON.stringify(result));
    throw new Error("Bling não retornou o ID da categoria criada");
  }
  return String(blingId);
}

export async function pushAllCategoriesToBling(): Promise<{ pushed: number; errors: number; details: string[] }> {
  const allCategories = await storage.getCategories();
  const unsyncedParents = allCategories.filter(c => !c.blingId && c.parentId === null);
  const unsyncedSubs = allCategories.filter(c => !c.blingId && c.parentId !== null);

  let pushed = 0;
  let errors = 0;
  const details: string[] = [];

  for (const cat of unsyncedParents) {
    try {
      const blingId = await createCategoryInBling(cat.name);
      await storage.updateCategory(cat.id, { blingId });
      pushed++;
      details.push(`✓ ${cat.name}`);
    } catch (err: any) {
      errors++;
      details.push(`✗ ${cat.name}: ${err.message}`);
      console.error(`Failed to push category "${cat.name}" to Bling:`, err.message);
    }
  }

  for (const sub of unsyncedSubs) {
    try {
      const parent = allCategories.find(c => c.id === sub.parentId);
      const updatedParent = parent ? await storage.getCategoryById(parent.id) : null;
      if (!updatedParent?.blingId) {
        errors++;
        details.push(`✗ ${sub.name}: categoria pai não está sincronizada`);
        continue;
      }
      const blingId = await createCategoryInBling(sub.name, updatedParent.blingId);
      await storage.updateCategory(sub.id, { blingId });
      pushed++;
      details.push(`✓ ${sub.name}`);
    } catch (err: any) {
      errors++;
      details.push(`✗ ${sub.name}: ${err.message}`);
      console.error(`Failed to push subcategory "${sub.name}" to Bling:`, err.message);
    }
  }

  return { pushed, errors, details };
}

export class BlingPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlingPermissionError";
  }
}

export async function fetchCategorias(): Promise<any[]> {
  const data = await blingGet("/categorias/produtos");
  return data.data || [];
}

export async function fetchProdutos(pagina: number = 1, limite: number = 100): Promise<{ data: any[]; hasMore: boolean }> {
  const data = await blingGet("/produtos", {
    pagina: String(pagina),
    limite: String(limite),
  });
  const items = data.data || [];
  return { data: items, hasMore: items.length >= limite };
}

export async function fetchAllProdutos(): Promise<any[]> {
  const allProducts: any[] = [];
  let pagina = 1;
  const limite = 100;
  const maxPages = 50;

  while (pagina <= maxPages) {
    const { data, hasMore } = await fetchProdutos(pagina, limite);
    allProducts.push(...data);
    if (!hasMore || data.length === 0) break;
    pagina++;
  }

  return allProducts;
}

export async function fetchProdutoDetalhes(id: number): Promise<any> {
  const data = await blingGet(`/produtos/${id}`);
  return data.data || null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function syncCategories(): Promise<{ synced: number }> {
  const blingCats = await fetchCategorias();
  let synced = 0;

  for (const cat of blingCats) {
    const blingId = String(cat.id);
    const name = cat.descricao || cat.nome || "Sem nome";

    await storage.upsertCategoryByBlingId(blingId, {
      name,
      slug: `bling-${slugify(name)}-${blingId}`,
      status: "Ativa",
    });
    synced++;
  }

  for (const cat of blingCats) {
    const parentBlingId = cat.categoriaPai?.id ? String(cat.categoriaPai.id) : null;
    if (!parentBlingId) continue;

    const blingId = String(cat.id);
    const parentCat = await storage.getCategoryByBlingId(parentBlingId);
    if (parentCat) {
      const childCat = await storage.getCategoryByBlingId(blingId);
      if (childCat) {
        await storage.upsertCategoryByBlingId(blingId, { parentId: parentCat.id });
      }
    }
  }

  return { synced };
}

export async function syncProducts(): Promise<{ synced: number }> {
  const blingProducts = await fetchAllProdutos();
  let synced = 0;

  console.log(`Bling: ${blingProducts.length} products found, syncing from list data...`);

  for (const prod of blingProducts) {
    try {
      const blingId = String(prod.id);
      const priceFloat = prod.preco ?? prod.precoCusto ?? 0;
      const priceInCents = Math.round(priceFloat * 100);

      const situacao = prod.situacao === "A" ? "Ativo" : "Inativo";
      const imageUrl = prod.imagemURL || prod.urlImagem || "";

      await storage.upsertProductByBlingId(blingId, {
        name: prod.nome || "Sem nome",
        sku: prod.codigo || `BLING-${blingId}`,
        categoryId: null,
        description: prod.descricaoCurta || "",
        price: priceInCents,
        image: imageUrl,
        packageType: prod.unidade || "UN",
        stock: 0,
        minStock: 10,
        status: situacao,
      });
      synced++;
    } catch (err) {
      console.error(`Error syncing product ${prod.id}:`, err);
    }
  }

  console.log(`Bling: ${synced} products synced successfully`);
  return { synced };
}

export async function syncAll(): Promise<{ categories: number; products: number; errors: string[] }> {
  const errors: string[] = [];
  let categories = 0;
  let products = 0;

  try {
    const catResult = await syncCategories();
    categories = catResult.synced;
  } catch (err: any) {
    console.error("syncAll - categories error:", err.message);
    if (err instanceof BlingPermissionError) {
      errors.push("Categorias: sem permissão no Bling");
    } else {
      errors.push(`Categorias: ${err.message}`);
    }
  }

  try {
    const prodResult = await syncProducts();
    products = prodResult.synced;
  } catch (err: any) {
    console.error("syncAll - products error:", err.message);
    if (err instanceof BlingPermissionError) {
      errors.push("Produtos: sem permissão no Bling");
    } else {
      errors.push(`Produtos: ${err.message}`);
    }
  }

  return { categories, products, errors };
}
