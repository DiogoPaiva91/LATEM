import { db } from "./db";
import { categories, products, customers, teamMembers } from "@shared/schema";

export async function seedDatabase() {
  const existingCats = await db.select().from(categories);
  if (existingCats.length > 0) return;

  const parentCategories = [
    { name: "Cimentos e Argamassas", slug: "cimentos", icon: "🧱", color: "#8B7355", image: "https://images.unsplash.com/photo-1590080877777-c5f5d1c6f3f6?auto=format&fit=crop&q=80&w=1200", sortOrder: 1 },
    { name: "Blocos e Tijolos", slug: "blocos", icon: "🏗️", color: "#A0522D", image: "https://images.unsplash.com/photo-1591557304120-6a697c0e5e75?auto=format&fit=crop&q=80&w=1200", sortOrder: 2 },
    { name: "Areia, Pedra e Agregados", slug: "areia", icon: "🪨", color: "#B8A88A", image: "https://images.unsplash.com/photo-1523419163445-589f3c8b6d89?auto=format&fit=crop&q=80&w=1200", sortOrder: 3 },
    { name: "Aço e Ferragens", slug: "aco", icon: "🔩", color: "#708090", image: "https://images.unsplash.com/photo-1581092334651-ddf26d9c8ed0?auto=format&fit=crop&q=80&w=1200", sortOrder: 4 },
    { name: "Tintas e Pintura", slug: "tintas", icon: "🎨", color: "#FF6B35", image: "https://images.unsplash.com/photo-1522968439036-e6338d0ed84a?auto=format&fit=crop&q=80&w=1200", sortOrder: 5 },
    { name: "Hidráulica", slug: "hidraulica", icon: "🚿", color: "#4A90D9", image: "https://images.unsplash.com/photo-1600697394937-599c0e0b8405?auto=format&fit=crop&q=80&w=1200", sortOrder: 6 },
    { name: "Elétrica", slug: "eletrica", icon: "⚡", color: "#F5A623", image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&q=80&w=1200", sortOrder: 7 },
    { name: "Portas, Janelas e Esquadrias", slug: "portas", icon: "🪟", color: "#6B8E23", image: "https://images.unsplash.com/photo-1565523925028-812f8917d94e?auto=format&fit=crop&q=80&w=1200", sortOrder: 8 },
    { name: "Pisos e Revestimentos", slug: "pisos", icon: "🧱", color: "#9B59B6", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200", sortOrder: 9 },
    { name: "Madeiras", slug: "madeiras", icon: "🪵", color: "#8B4513", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1200", sortOrder: 10 },
    { name: "Impermeabilização", slug: "impermeabilizacao", icon: "💧", color: "#2980B9", image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3d?auto=format&fit=crop&q=80&w=1200", sortOrder: 11 },
    { name: "Segurança e EPI", slug: "seguranca", icon: "🦺", color: "#E74C3C", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200", sortOrder: 12 },
    { name: "Ferramentas", slug: "ferramentas", icon: "🔧", color: "#34495E", image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=1200", sortOrder: 13 },
    { name: "Cobertura e Telhas", slug: "cobertura", icon: "🏠", color: "#C0392B", image: "https://images.unsplash.com/photo-1590725121839-892b458a74fe?auto=format&fit=crop&q=80&w=1200", sortOrder: 14 },
    { name: "Jardim e Área Externa", slug: "jardim", icon: "🌿", color: "#27AE60", image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&q=80&w=1200", sortOrder: 15 },
    { name: "Utilidades e Consumíveis", slug: "utilidades", icon: "📦", color: "#95A5A6", image: "https://images.unsplash.com/photo-1581579185169-7bdfaa39f4a6?auto=format&fit=crop&q=80&w=1200", sortOrder: 16 },
  ];

  const insertedParents = await db.insert(categories).values(parentCategories.map(c => ({ ...c, parentId: null, productCount: 0, status: "Ativa" as const }))).returning();

  const subcategoryMap: Record<string, string[]> = {
    "cimentos": ["Cimentos", "Argamassas", "Rejuntes", "Concreto Pronto"],
    "blocos": ["Blocos de Concreto", "Tijolos Cerâmicos", "Blocos de Vidro", "Lajes Pré-Moldadas"],
    "areia": ["Areia", "Pedra Brita", "Pedrisco e Cascalho", "Pedra Decorativa"],
    "aco": ["Vergalhões", "Telas e Arames", "Pregos", "Parafusos e Fixadores"],
    "tintas": ["Tintas", "Massa e Selador", "Textura e Grafiato", "Verniz", "Acessórios de Pintura"],
    "hidraulica": ["Tubos e Conexões", "Registros e Válvulas", "Caixas D'água", "Torneiras e Misturadores"],
    "eletrica": ["Fios e Cabos", "Disjuntores e Quadros", "Tomadas e Interruptores", "Lâmpadas e Luminárias"],
    "portas": ["Portas", "Janelas", "Fechaduras e Dobradiças", "Vidros"],
    "pisos": ["Porcelanatos", "Cerâmicas", "Pisos Vinílicos", "Rodapés"],
    "madeiras": ["Tábuas", "Compensados", "MDF e MDP", "Caibros e Ripas"],
    "impermeabilizacao": ["Mantas", "Impermeabilizantes Líquidos", "Selantes", "Fitas"],
    "seguranca": ["Capacetes", "Luvas", "Botas", "Óculos"],
    "ferramentas": ["Ferramentas Elétricas", "Ferramentas Manuais", "Medição", "Acessórios"],
    "cobertura": ["Telhas", "Cumeeiras", "Calhas", "Parafusos"],
    "jardim": ["Mangueiras", "Irrigação", "Ferramentas", "Vasos"],
    "utilidades": ["Limpeza", "Descartáveis", "Fitas", "Organização"],
  };

  for (const parent of insertedParents) {
    const subs = subcategoryMap[parent.slug] || [];
    if (subs.length > 0) {
      await db.insert(categories).values(
        subs.map((name, i) => ({
          name,
          slug: `${parent.slug}-${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")}`,
          icon: parent.icon,
          color: parent.color,
          parentId: parent.id,
          productCount: 0,
          status: "Ativa" as const,
          sortOrder: i + 1,
        }))
      );
    }
  }

  const ferramentasParent = insertedParents.find(c => c.slug === "ferramentas");
  const tintasParent = insertedParents.find(c => c.slug === "tintas");
  const eletricaParent = insertedParents.find(c => c.slug === "eletrica");
  const cimentosParent = insertedParents.find(c => c.slug === "cimentos");
  const hidraulicaParent = insertedParents.find(c => c.slug === "hidraulica");
  const pisosParent = insertedParents.find(c => c.slug === "pisos");

  await db.insert(products).values([
    { name: "Furadeira de Impacto Profissional 650W", sku: "FER001", categoryId: ferramentasParent?.id, price: 24990, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=500", description: "Furadeira de alto desempenho para concreto, madeira e metal.", packageType: "Unidade", stock: 45, minStock: 10, status: "Ativo", specs: { "Potência": "650W", "Voltagem": "220V", "Mandril": "1/2\"" } },
    { name: "Kit Chaves de Fenda e Phillips (10 Peças)", sku: "FER002", categoryId: ferramentasParent?.id, price: 8990, image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=500", description: "Aço cromo vanádio com ponta magnética.", packageType: "Kit", stock: 120, minStock: 30, status: "Ativo", specs: { "Material": "Cromo Vanádio", "Peças": "10" } },
    { name: "Tinta Acrílica Fosca Branco Neve 18L", sku: "TIN001", categoryId: tintasParent?.id, price: 32900, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=500", description: "Alto rendimento e cobertura.", packageType: "Unidade", stock: 80, minStock: 20, status: "Ativo", specs: { "Acabamento": "Fosco", "Volume": "18L", "Cor": "Branco Neve" } },
    { name: "Lâmpada LED Bulbo 9W 6500K", sku: "ELE001", categoryId: eletricaParent?.id, price: 990, image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=500", description: "Economia de energia com alta luminosidade.", packageType: "Unidade", stock: 500, minStock: 100, status: "Ativo", specs: { "Potência": "9W", "Temperatura": "6500K", "Base": "E27" } },
    { name: "Cimento CP-II 50kg", sku: "CIM001", categoryId: cimentosParent?.id, price: 3250, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500", description: "Cimento portland de uso geral.", packageType: "Saco 50kg", stock: 200, minStock: 50, status: "Ativo", specs: { "Tipo": "CP-II", "Peso": "50kg" } },
    { name: "Disjuntor Unipolar 20A Curva C", sku: "ELE002", categoryId: eletricaParent?.id, price: 1290, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=500", description: "Proteção para circuitos elétricos residenciais.", packageType: "Unidade", stock: 300, minStock: 50, status: "Ativo", specs: { "Corrente": "20A", "Curva": "C", "Polos": "1" } },
    { name: "Tubo PVC Esgoto 100mm (Barra 6m)", sku: "HID001", categoryId: hidraulicaParent?.id, price: 4500, image: "https://images.unsplash.com/photo-1605696850422-9653198030eb?auto=format&fit=crop&q=80&w=500", description: "Alta resistência e durabilidade.", packageType: "Barra 6m", stock: 150, minStock: 30, status: "Ativo", specs: { "Diâmetro": "100mm", "Comprimento": "6m", "Tipo": "Esgoto" } },
    { name: "Revestimento Cerâmico 60x60 Mármore", sku: "PIS001", categoryId: pisosParent?.id, price: 4990, image: "https://images.unsplash.com/photo-1615971677499-54678dd53f0d?auto=format&fit=crop&q=80&w=500", description: "Acabamento brilhante, borda retificada.", packageType: "Caixa c/ 12 un.", stock: 85, minStock: 20, status: "Ativo", specs: { "Formato": "60x60cm", "Tipo": "A", "Acabamento": "Brilhante" } },
  ]);

  await db.insert(customers).values([
    { name: "ConstruTech Ltda", cnpj: "12.345.678/0001-90", email: "contato@construtech.com.br", segment: "Depósito", status: "Ativo", lastOrderAmount: "R$ 4.250,00" },
    { name: "Ferragens Silva", cnpj: "98.765.432/0001-10", email: "compras@ferragenssilva.com", segment: "Varejo", status: "Ativo", lastOrderAmount: "R$ 1.120,00" },
    { name: "Obras Rápidas S.A.", cnpj: "45.678.912/0001-55", email: "financeiro@obrasrapidas.com", segment: "Construtora", status: "Aguardando", lastOrderAmount: "R$ 15.800,00" },
    { name: "Mestre da Obra", cnpj: "22.333.444/0001-00", email: "adm@mestredaobra.com.br", segment: "Depósito", status: "Inativo", lastOrderAmount: "R$ 850,00" },
    { name: "Casa do Construtor", cnpj: "11.222.333/0001-44", email: "vendas@casaconstrutor.com", segment: "Varejo", status: "Ativo", lastOrderAmount: "R$ 2.300,00" },
  ]);

  await db.insert(teamMembers).values([
    { name: "João Costa", email: "joao@costamarta.com", role: "Administrador", whatsapp: "(11) 99999-0001", status: "Ativo", admissionDate: "2023-01-15" },
    { name: "Maria Silva", email: "maria@costamarta.com", role: "Vendedor", whatsapp: "(11) 99999-0002", status: "Ativo", admissionDate: "2023-03-20" },
    { name: "Pedro Santos", email: "pedro@costamarta.com", role: "Estoquista", whatsapp: "(11) 99999-0003", status: "Ativo", admissionDate: "2024-01-10" },
    { name: "Ana Oliveira", email: "ana@costamarta.com", role: "Financeiro", whatsapp: "(11) 99999-0004", status: "Inativo", admissionDate: "2023-06-01" },
  ]);

  console.log("Database seeded successfully!");
}
