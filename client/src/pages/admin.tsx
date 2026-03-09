import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/layout";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import TeamTab from "@/components/admin/TeamTab";
import { BlingTab } from "@/components/admin/BlingTab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Search, 
  MoreHorizontal, 
  UserPlus,
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Truck,
  Layers,
  Archive,
  Bell,
  Phone,
  Mail,
  Lock,
  FolderTree,
  Scale,
  Plug
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

// Mock Data
const initialCustomers = [
  { id: "1", name: "ConstruTech Ltda", cnpj: "12.345.678/0001-90", segment: "Depósito", lastOrder: "R$ 4.250,00", status: "Ativo", email: "contato@construtech.com.br" },
  { id: "2", name: "Ferragens Silva", cnpj: "98.765.432/0001-10", segment: "Varejo", lastOrder: "R$ 1.120,00", status: "Ativo", email: "compras@ferragenssilva.com" },
  { id: "3", name: "Obras Rápidas S.A.", cnpj: "45.678.912/0001-55", segment: "Construtora", lastOrder: "R$ 15.800,00", status: "Aguardando", email: "financeiro@obrasrapidas.com" },
  { id: "4", name: "Mestre da Obra", cnpj: "22.333.444/0001-00", segment: "Depósito", lastOrder: "R$ 850,00", status: "Inativo", email: "adm@mestredaobra.com.br" },
  { id: "5", name: "Casa do Construtor", cnpj: "11.222.333/0001-44", segment: "Varejo", lastOrder: "R$ 2.300,00", status: "Ativo", email: "vendas@casaconstrutor.com" },
];

const initialProducts = [
  { id: "1", name: "Cimento Cola Indeflex AC1 CZ", sku: "423460", category: "🧱 Básicos", package: "Fardo c/ 6 un.", price: "R$ 7,63", stock: 120, minStock: 50, status: "Ativo", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&h=100&fit=crop" },
  { id: "2", name: "Tinta Acrílica Fosca Branca 18L", sku: "551230", category: "🎨 Tintas", package: "Unidade", price: "R$ 189,90", stock: 15, minStock: 20, status: "Ativo", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&h=100&fit=crop" },
  { id: "3", name: "Porcelanato Acetinado 60x60", sku: "889901", category: "🧱 Revestimentos", package: "Caixa c/ 12 un.", price: "R$ 45,90", stock: 350, minStock: 100, status: "Ativo", image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=100&h=100&fit=crop" },
  { id: "4", name: "Tubo PVC Esgoto 100mm 6m", sku: "112233", category: "🚿 Hidráulica", package: "Fardo c/ 10 un.", price: "R$ 38,50", stock: 8, minStock: 50, status: "Inativo", image: "https://images.unsplash.com/photo-1585200213795-467406a461b1?w=100&h=100&fit=crop" },
  { id: "5", name: "Cabo Flexível 2.5mm Azul 100m", sku: "445566", category: "⚡ Elétrica", package: "Rolo 100m", price: "R$ 125,00", stock: 45, minStock: 30, status: "Ativo", image: "https://images.unsplash.com/photo-1558227691-41ea78d1f631?w=100&h=100&fit=crop" },
];

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  
  const { data: customers = [] } = useQuery<any[]>({ queryKey: ["/api/customers"] });
  const { data: products = [] } = useQuery<any[]>({ queryKey: ["/api/products"] });

  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    cnpj: "",
    email: "",
    segment: "Varejo"
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    package: "Unidade",
    packageQty: 1,
    stock: 0,
    status: true
  });

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  
  const createCustomerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/customers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsNewCustomerOpen(false);
      setNewCustomer({ name: "", cnpj: "", email: "", segment: "Varejo" });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setActiveTab('products');
      setNewProduct({ name: "", sku: "", category: "", price: "", package: "Unidade", packageQty: 1, stock: 0, status: true });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProductId(null);
      setActiveTab('products');
      setNewProduct({ name: "", sku: "", category: "", price: "", package: "Unidade", packageQty: 1, stock: 0, status: true });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/products"] }),
  });

  const handleAddCustomer = () => {
    createCustomerMutation.mutate(newCustomer);
  };

  const handleAddProduct = () => {
    const productData = {
      name: newProduct.name,
      sku: newProduct.sku || Math.floor(Math.random() * 1000000).toString(),
      price: Math.round(parseFloat(newProduct.price.replace(',', '.')) * 100),
      packageType: newProduct.package === "Personalizado" ? `${newProduct.packageQty} un.` : newProduct.package,
      stock: newProduct.stock,
      status: newProduct.status ? "Ativo" : "Inativo",
      categoryId: null, // Simple approach as requested
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&h=100&fit=crop"
    };

    if (editingProductId) {
      updateProductMutation.mutate({ id: editingProductId, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category || "", 
      package: product.packageType?.includes("un.") ? "Personalizado" : (product.packageType || "Unidade"),
      packageQty: parseInt(product.packageType?.replace(/\D/g, '')) || 1,
      price: (product.price / 100).toString(),
      stock: product.stock,
      status: product.status === "Ativo"
    });
    setActiveTab('new-product');
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const generateSku = () => {
    setNewProduct({...newProduct, sku: Math.floor(100000 + Math.random() * 900000).toString()});
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cnpj.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.sku.includes(productSearchTerm)
  );

  return (
    <Layout>
      <div className="flex min-h-screen bg-muted/20">
        {/* Sidebar */}
        <aside 
          className={`bg-[#01034a] flex flex-col items-center py-4 gap-2 hidden md:flex sticky top-0 h-screen transition-all duration-300 ${
            isSidebarExpanded ? 'w-64' : 'w-20'
          }`}
        >
          <div className="flex items-center w-full px-4 mb-0 h-16 relative justify-center mt-2">
            <div className={`flex items-center justify-center w-full transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <div 
                className="h-32 w-56 rounded-lg flex items-center justify-center shrink-0 p-0 bg-transparent mt-0 relative z-10 cursor-pointer"
                onClick={() => setLocation('/')}
              >
                <img src="/logo.png" alt="Costa Marta" className="absolute h-[60%] w-auto max-w-none object-contain drop-shadow-md scale-100 hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
            <div 
              className={`w-8 h-8 ${isSidebarExpanded ? 'bg-white/10 hover:bg-[#fdd700] hover:text-[#01034a] text-white absolute right-2 top-0 z-20' : 'bg-[#fdd700] text-[#01034a] hover:scale-105 hover:shadow-lg hover:shadow-[#fdd700]/20 absolute z-20 mx-auto top-4 right-6'} rounded-lg flex items-center justify-center shadow-sm cursor-pointer shrink-0 transition-all duration-300`}
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              title={isSidebarExpanded ? "Recolher menu" : "Expandir menu"}
            >
              <LayoutDashboard className="h-4 w-4" />
            </div>
          </div>
          <nav className="flex flex-col gap-4 w-full px-4 mt-2">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <TrendingUp className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Painel</span>}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("customers")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'customers' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Users className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Clientes</span>}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("categories")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'categories' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Tag className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Categorias</span>}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("team")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'team' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              title="Equipe"
            >
              <Users className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Equipe</span>}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("products")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'products' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Package className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Produtos</span>}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("orders")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'orders' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <ShoppingBag className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Pedidos</span>}
            </Button>
          </nav>
          <div className="mt-auto pb-4 w-full px-4 mb-2 space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("integracoes")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'integracoes' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              data-testid="tab-integracoes"
            >
              <Plug className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Integrações</span>}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("settings")}
              className={`w-full h-12 rounded-xl transition-all duration-300 flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'} ${activeTab === 'settings' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Settings className="h-6 w-6 shrink-0" />
              {isSidebarExpanded && <span className="ml-3 font-medium">Configurações</span>}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto h-screen bg-[fafafa]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {activeTab !== 'categories' && activeTab !== 'team' && activeTab !== 'integracoes' && (
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-[#01034a]">
                  {activeTab === 'dashboard' && 'Painel de Gestão'}
                  {activeTab === 'customers' && 'Clientes B2B'}
                  {activeTab === 'new-customer' && 'Novo Cliente'}
                  {activeTab === 'products' && 'Catálogo de Produtos'}
                  {activeTab === 'orders' && 'Pedidos Recentes'}
                  {activeTab === 'settings' && 'Configurações do Sistema'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'dashboard' && 'Visão geral do desempenho do atacado.'}
                  {activeTab === 'customers' && 'Gerencie sua base de clientes e aprovações.'}
                  {activeTab === 'new-customer' && 'Preencha os dados abaixo para cadastrar um novo parceiro.'}
                  {activeTab === 'products' && 'Controle de estoque e preços.'}
                  {activeTab === 'orders' && 'Acompanhe o status dos pedidos.'}
                  {activeTab === 'settings' && 'Gerencie as preferências e parâmetros do atacado.'}
                </p>
              </div>
              
              <div className="flex gap-3">
                 {activeTab === 'customers' && (
                   <Button onClick={() => setActiveTab('new-customer')} className="bg-[#01034a] text-white hover:bg-[#01034a]/90 rounded-xl gap-2 h-12 px-6 shadow-lg shadow-[#01034a]/20">
                     <UserPlus className="h-5 w-5" /> Novo Cliente
                   </Button>
                 )}
                 {activeTab === 'products' && (
                   <Button onClick={() => {
                     setEditingProductId(null);
                     setNewProduct({ name: "", sku: "", category: "", price: "", package: "Unidade", packageQty: 1, stock: 0, status: true });
                     setActiveTab('new-product');
                   }} className="bg-[#01034a] text-white hover:bg-[#01034a]/90 rounded-xl gap-2 h-12 px-6 shadow-lg shadow-[#01034a]/20">
                     <Plus className="h-5 w-5" /> Cadastrar Produto
                   </Button>
                 )}
                 {activeTab === 'new-customer' && (
                   <Button variant="outline" onClick={() => setActiveTab('customers')} className="rounded-xl h-12 px-6 gap-2 border-muted hover:bg-muted/20">
                      Voltar para Lista
                   </Button>
                 )}
                 {activeTab === 'new-product' && (
                   <Button variant="outline" onClick={() => setActiveTab('products')} className="rounded-xl h-12 px-6 gap-2 border-muted hover:bg-muted/20">
                      Voltar para Catálogo
                   </Button>
                 )}
                 {activeTab !== 'new-customer' && activeTab !== 'new-product' && (
                   <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-muted hover:bg-muted/20">
                      <Download className="h-4 w-4" /> Exportar CSV
                   </Button>
                 )}
              </div>
              </header>
            )}

            <TabsContent value="categories" className="mt-0 space-y-0">
              <CategoriesTab />
            </TabsContent>

            <TabsContent value="team" className="mt-0 space-y-0">
              <TeamTab />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-8 mt-0">
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm rounded-xl bg-white hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                        <h3 className="text-2xl font-bold text-[#01034a] mt-1">{customers.length}</h3>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-green-600 font-bold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> +12%
                      </span>
                      vs. mês anterior
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-sm rounded-xl bg-white hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pedidos do Mês</p>
                        <h3 className="text-2xl font-bold text-[#01034a] mt-1">856</h3>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-green-600 font-bold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> +8%
                      </span>
                      vs. mês anterior
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-xl bg-white hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Faturamento</p>
                        <h3 className="text-2xl font-bold text-[#01034a] mt-1">R$ 1.2M</h3>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                         <span className="font-bold text-lg">$</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-green-600 font-bold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> +24%
                      </span>
                      vs. mês anterior
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Chart Placeholder */}
                 <Card className="border-none shadow-xl rounded-3xl bg-white lg:col-span-2 hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                       <CardTitle className="text-xl font-bold font-display text-[#01034a]">Vendas da Semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pt-8 pb-2">
                          {[40, 65, 34, 78, 55, 90, 60].map((h, i) => (
                             <div key={i} className="flex flex-col items-center gap-2 group w-full h-full justify-end">
                                <div className="w-full bg-muted/30 rounded-t-xl h-full max-h-[250px] relative overflow-hidden">
                                   <div 
                                      className="absolute bottom-0 left-0 w-full bg-[#01034a] rounded-t-xl transition-all duration-500 group-hover:bg-[#fdd700]" 
                                      style={{ height: `${h}%` }}
                                   ></div>
                                </div>
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-[#01034a] transition-colors">
                                   {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                                </span>
                             </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>

                 {/* Recent Activity */}
                 <Card className="border-none shadow-xl rounded-3xl bg-white lg:col-span-1 hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                       <CardTitle className="text-xl font-bold font-display text-[#01034a]">Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-6">
                          {[
                             { user: 'ConstruTech', action: 'novo pedido', time: '2 min atrás', value: 'R$ 4.500', icon: Package, color: 'text-blue-600 bg-blue-50' },
                             { user: 'Ferragens Silva', action: 'cadastro aprovado', time: '15 min atrás', value: null, icon: UserPlus, color: 'text-green-600 bg-green-50' },
                             { user: 'Mestre da Obra', action: 'pagamento confirmado', time: '1h atrás', value: 'R$ 1.200', icon: ShoppingBag, color: 'text-orange-600 bg-orange-50' },
                             { user: 'Depósito Central', action: 'novo pedido', time: '3h atrás', value: 'R$ 8.900', icon: Package, color: 'text-blue-600 bg-blue-50' },
                             { user: 'Casa Nova', action: 'solicitação de orçamento', time: '5h atrás', value: null, icon: FileText, color: 'text-purple-600 bg-purple-50' },
                          ].map((item, i) => (
                             <div key={i} className="flex gap-4 items-start pb-4 border-b border-muted/50 last:border-0 last:pb-0">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                                   <item.icon className="h-5 w-5" />
                                </div>
                                <div>
                                   <p className="text-sm font-medium text-[#01034a]">
                                      <span className="font-bold">{item.user}</span> <span className="text-muted-foreground text-xs block">{item.action}</span>
                                   </p>
                                   {item.value && <p className="text-xs font-bold text-[#01034a] bg-muted px-2 py-0.5 rounded-full inline-block mt-1">{item.value}</p>}
                                   <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span> {item.time}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="mt-0">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-white px-8 py-6 border-b border-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg h-9 bg-muted/20 border-muted hover:bg-muted/40 text-muted-foreground hover:text-foreground">
                      Todos
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 text-muted-foreground hover:text-foreground">
                      Ativos
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 text-muted-foreground hover:text-foreground">
                      Inativos
                    </Button>
                  </div>
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por CNPJ, Nome ou Email..." 
                      className="pl-10 h-10 rounded-xl bg-muted/30 border-muted focus:bg-white transition-all" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-muted">
                        <TableHead className="px-8 py-4 font-bold text-[#01034a]">Cliente</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Contato</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Segmento</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Último Pedido</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Status</TableHead>
                        <TableHead className="text-right px-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-muted/10 border-muted/50 transition-colors">
                            <TableCell className="px-8 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#01034a] text-base">{customer.name}</span>
                                <span className="text-muted-foreground text-xs font-mono">{customer.cnpj}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-lg border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                {customer.segment}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold text-[#01034a]">{customer.lastOrder}</TableCell>
                            <TableCell>
                              <Badge 
                                className={`rounded-lg px-2.5 py-0.5 border shadow-sm ${
                                  customer.status === 'Ativo' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 
                                  customer.status === 'Aguardando' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                }`}
                              >
                                {customer.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-muted rounded-xl h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-muted">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuItem className="cursor-pointer">Ver Detalhes</DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">Editar Cadastro</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                    Bloquear Cliente
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            Nenhum cliente encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="new-customer" className="mt-0">
               <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white max-w-4xl mx-auto relative">
                 {/* Mascote no canto superior direito */}
                 <div className="absolute right-0 top-0 w-32 h-32 hidden md:block" style={{ zIndex: 10 }}>
                   <img 
                     src="/mascot.png" 
                     alt="Mascote TheTeo" 
                     className="w-full h-full object-contain object-bottom drop-shadow-xl translate-y-2 -translate-x-2"
                   />
                 </div>

                 <div className="bg-[#01034a] p-8 text-white relative z-0">
                   <h2 className="font-display text-2xl font-bold text-[#fdd700] md:pr-24">Novo Cliente</h2>
                   <p className="text-white/70 mt-1 md:pr-24">Preencha os dados abaixo para cadastrar um novo parceiro no sistema.</p>
                 </div>
                 
                 <div className="p-8 space-y-8">
                   <div className="space-y-6">
                     <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2 mb-6">
                       <Users className="h-5 w-5 text-[#fdd700]" />
                       <span className="uppercase tracking-wider text-sm">Informações Jurídicas</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label htmlFor="cnpj" className="font-medium text-gray-700">CNPJ</Label>
                         <div className="relative">
                           <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input 
                            id="cnpj" 
                            placeholder="00.000.000/0001-00" 
                            value={newCustomer.cnpj} 
                            onChange={(e) => setNewCustomer({...newCustomer, cnpj: e.target.value})}
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" 
                          />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="segment" className="font-medium text-gray-700">Segmento</Label>
                         <Select 
                          value={newCustomer.segment} 
                          onValueChange={(val) => setNewCustomer({...newCustomer, segment: val})}
                         >
                           <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg">
                             <SelectValue placeholder="Selecione..." />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Varejo">Varejo</SelectItem>
                             <SelectItem value="Depósito">Depósito</SelectItem>
                             <SelectItem value="Construtora">Construtora</SelectItem>
                             <SelectItem value="Outros">Outros</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>

                       <div className="space-y-2 md:col-span-2">
                         <Label htmlFor="razao" className="font-medium text-gray-700">Razão Social</Label>
                         <div className="relative">
                           <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input 
                            id="razao" 
                            placeholder="Nome Jurídico da Empresa" 
                            value={newCustomer.name} 
                            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" 
                          />
                         </div>
                       </div>

                       <div className="space-y-2 md:col-span-2">
                         <Label htmlFor="fantasia" className="font-medium text-gray-700">Nome da Loja (Fantasia)</Label>
                         <div className="relative">
                           <ShoppingBag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input id="fantasia" placeholder="Nome da Loja" className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" />
                         </div>
                       </div>
                     </div>

                     <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2 mb-6 pt-6">
                       <Users className="h-5 w-5 text-[#fdd700]" />
                       <span className="uppercase tracking-wider text-sm">Contato e Acesso</span>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label htmlFor="responsavel" className="font-medium text-gray-700">Nome do Responsável</Label>
                         <div className="relative">
                           <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input id="responsavel" placeholder="Seu nome completo" className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="celular" className="font-medium text-gray-700">Celular / WhatsApp</Label>
                         <div className="relative">
                           <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input id="celular" placeholder="(11) 99999-9999" className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" />
                         </div>
                       </div>
                       
                       <div className="space-y-2 md:col-span-2">
                         <Label htmlFor="email" className="font-medium text-gray-700">E-mail Comercial</Label>
                         <div className="relative">
                           <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input 
                            id="email" 
                            type="email" 
                            placeholder="compras@suaempresa.com.br" 
                            value={newCustomer.email} 
                            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" 
                          />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="senha" className="font-medium text-gray-700">Senha</Label>
                         <div className="relative">
                           <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input id="senha" type="password" className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="confirma_senha" className="font-medium text-gray-700">Confirmar Senha</Label>
                         <div className="relative">
                           <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input id="confirma_senha" type="password" className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" />
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex items-start space-x-2 pt-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#01034a] focus:ring-[#01034a]" />
                        <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer text-gray-600">
                          Declaro que sou lojista e concordo com a <span className="text-[#01034a] font-medium hover:underline">Política de Privacidade</span> e <span className="text-[#01034a] font-medium hover:underline">Termos de Uso</span>.
                        </Label>
                     </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-4 border-t">
                     <Button variant="outline" onClick={() => setActiveTab('customers')} className="rounded-xl h-12 px-8 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                       Cancelar
                     </Button>
                     <Button onClick={() => { handleAddCustomer(); setActiveTab('customers'); }} className="bg-[#01034a] text-white hover:bg-[#01034a]/90 font-bold rounded-xl h-12 px-8 shadow-lg shadow-[#01034a]/20">
                       <UserPlus className="mr-2 h-5 w-5" /> Cadastrar Cliente
                     </Button>
                   </div>
                 </div>
               </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-white px-8 py-6 border-b border-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-10 rounded-xl bg-muted/20 border-muted">
                        <SelectValue placeholder="Todas as Categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        <SelectItem value="cimentos">🧱 Cimentos e Argamassas</SelectItem>
                        <SelectItem value="eletrica">💡 Elétrica e Iluminação</SelectItem>
                        <SelectItem value="hidraulica">🚰 Hidráulica</SelectItem>
                        <SelectItem value="pintura">🎨 Pintura</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="ativos">
                      <SelectTrigger className="w-[140px] h-10 rounded-xl bg-muted/20 border-muted">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="ativos">Ativos</SelectItem>
                        <SelectItem value="inativos">Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por Nome ou SKU..." 
                      className="pl-10 h-10 rounded-xl bg-muted/30 border-muted focus:bg-white transition-all" 
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-muted">
                        <TableHead className="px-8 py-4 font-bold text-[#01034a]">Produto</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Categoria</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Embalagem</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Preço Un.</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Estoque</TableHead>
                        <TableHead className="font-bold text-[#01034a]">Status</TableHead>
                        <TableHead className="text-right px-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id} className="hover:bg-muted/10 border-muted/50 transition-colors">
                            <TableCell className="px-8 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#01034a] text-sm max-w-[200px] truncate" title={product.name}>{product.name}</span>
                                  <span className="text-muted-foreground text-xs font-mono">SKU: {product.sku}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{product.category}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-md border-gray-200 bg-gray-50 text-gray-600 font-normal">
                                {product.package}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold text-[#01034a]">R$ {(product.price / 100).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 w-24">
                                <div className="flex justify-between text-xs">
                                  <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                                    {product.stock} un.
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${product.stock <= product.minStock ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`rounded-lg px-2.5 py-0.5 border shadow-sm ${
                                  product.status === 'Ativo' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 
                                  'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center">
                               <Package className="h-10 w-10 text-gray-300 mb-2" />
                               <p>Nenhum produto encontrado.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="new-product" className="mt-0">
               <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white max-w-5xl mx-auto relative">
                 {/* Mascote no canto superior direito */}
                 <div className="absolute right-0 top-0 w-32 h-32 hidden md:block" style={{ zIndex: 10 }}>
                   <img 
                     src="/mascot.png" 
                     alt="Mascote TheTeo" 
                     className="w-full h-full object-contain object-bottom drop-shadow-xl translate-y-2 -translate-x-2"
                   />
                 </div>

                 <div className="bg-[#01034a] p-8 text-white relative z-0">
                   <h2 className="font-display text-2xl font-bold text-[#fdd700] md:pr-24">
                     {editingProductId ? "Editar Produto" : "Cadastrar Produto"}
                   </h2>
                   <p className="text-white/70 mt-1 md:pr-24">
                     {editingProductId ? "Edite as informações deste item do catálogo." : "Adicione um novo item ao catálogo de atacado."}
                   </p>
                 </div>
                 
                 <div className="p-8 space-y-10">
                   {/* Informações Básicas */}
                   <div className="space-y-6">
                     <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2">
                       <Package className="h-5 w-5 text-[#fdd700]" />
                       <span className="uppercase tracking-wider text-sm">Informações Básicas</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                       <div className="md:col-span-8 space-y-2">
                         <Label htmlFor="prod-name" className="font-medium text-gray-700">Nome do Produto <span className="text-red-500">*</span></Label>
                         <div className="relative">
                           <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input 
                            id="prod-name" 
                            placeholder="Ex: Cimento Cola Indeflex AC1 CZ 05K" 
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" 
                          />
                         </div>
                       </div>

                       <div className="md:col-span-4 space-y-2">
                         <Label htmlFor="sku" className="font-medium text-gray-700">SKU / Código <span className="text-red-500">*</span></Label>
                         <div className="flex gap-2 relative">
                           <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                           <Input 
                            id="sku" 
                            placeholder="Ex: 423460" 
                            value={newProduct.sku}
                            onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg font-mono flex-1" 
                          />
                          <Button onClick={generateSku} variant="outline" className="h-12 px-3 border-gray-200 text-gray-600 shrink-0" title="Gerar código aleatório">
                            Gerar
                          </Button>
                         </div>
                       </div>

                       <div className="md:col-span-6 space-y-2">
                         <Label htmlFor="prod-category" className="font-medium text-gray-700">Categoria <span className="text-red-500">*</span></Label>
                         <div className="relative">
                           <FolderTree className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10" />
                           <Select 
                            value={newProduct.category} 
                            onValueChange={(val) => setNewProduct({...newProduct, category: val})}
                           >
                             <SelectTrigger className="h-12 pl-10 bg-gray-50 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg relative">
                               <SelectValue placeholder="Selecione uma categoria..." />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="🧱 Cimentos e Argamassas">🧱 Cimentos e Argamassas</SelectItem>
                               <SelectItem value="💡 Elétrica e Iluminação">💡 Elétrica e Iluminação</SelectItem>
                               <SelectItem value="🚰 Hidráulica">🚰 Hidráulica</SelectItem>
                               <SelectItem value="🎨 Pintura">🎨 Pintura</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <p className="text-xs text-blue-600 text-right cursor-pointer hover:underline">Criar categoria primeiro</p>
                       </div>

                       <div className="md:col-span-12 space-y-2">
                         <Label className="font-medium text-gray-700">Imagens do Produto</Label>
                         <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700">Clique para fazer upload ou arraste as imagens aqui</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG ou WEBP (Max. 5MB). A primeira imagem será a principal.</p>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Preço e Embalagem */}
                   <div className="space-y-6">
                     <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2">
                       <span className="text-xl">💰</span>
                       <span className="uppercase tracking-wider text-sm">Preço e Embalagem</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-blue-50/30 p-6 rounded-xl border border-blue-100">
                       
                       <div className="md:col-span-4 space-y-2">
                         <Label htmlFor="price" className="font-medium text-gray-700">Preço Unitário <span className="text-red-500">*</span></Label>
                         <div className="relative">
                           <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                           <Input 
                            id="price" 
                            placeholder="0,00" 
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            className="bg-white pl-10 h-12 border-gray-200 focus:border-[#01034a] transition-all rounded-lg text-lg font-bold" 
                          />
                         </div>
                       </div>

                       <div className="md:col-span-4 space-y-2">
                         <Label htmlFor="promo-price" className="font-medium text-gray-700">Preço Promocional</Label>
                         <div className="relative">
                           <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                           <Input 
                            id="promo-price" 
                            placeholder="0,00" 
                            className="bg-white pl-10 h-12 border-gray-200 focus:border-[#01034a] transition-all rounded-lg" 
                          />
                         </div>
                       </div>

                       <div className="md:col-span-12 pt-4">
                         <Label className="font-medium text-gray-700 mb-3 block">Tipo de Embalagem (Como será vendido) <span className="text-red-500">*</span></Label>
                         <div className="flex flex-wrap gap-3 mb-6">
                            {[
                              { label: 'Unidade', val: 'Unidade', qty: 1 },
                              { label: 'Fardo c/ 6', val: 'Fardo c/ 6 un.', qty: 6 },
                              { label: 'Caixa c/ 12', val: 'Caixa c/ 12 un.', qty: 12 },
                              { label: 'Palete c/ 4', val: 'Palete c/ 4 sacos', qty: 4 },
                              { label: 'Personalizado', val: 'Personalizado', qty: '' }
                            ].map((pkg) => (
                              <button
                                key={pkg.label}
                                onClick={() => setNewProduct({...newProduct, package: pkg.val, packageQty: Number(pkg.qty) || 1})}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  newProduct.package === pkg.val 
                                    ? 'bg-[#01034a] text-white border-[#01034a] shadow-md' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#01034a]/30 hover:bg-gray-50'
                                }`}
                              >
                                {pkg.label}
                              </button>
                            ))}
                         </div>

                         {newProduct.package === 'Personalizado' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-200 mb-6">
                              <div className="space-y-2">
                                <Label className="text-sm text-gray-600">Qtd. por Embalagem</Label>
                                <div className="relative">
                                  <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    value={newProduct.packageQty}
                                    onChange={(e) => setNewProduct({...newProduct, packageQty: Number(e.target.value) || 1})}
                                    className="h-10 pl-9" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm text-gray-600">Unidade de Medida</Label>
                                <div className="relative">
                                  <Scale className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
                                  <Select defaultValue="un">
                                    <SelectTrigger className="h-10 pl-9 relative">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="un">Unidade (un)</SelectItem>
                                      <SelectItem value="kg">Quilo (kg)</SelectItem>
                                      <SelectItem value="m">Metro (m)</SelectItem>
                                      <SelectItem value="m2">Metro Quadrado (m²)</SelectItem>
                                      <SelectItem value="pc">Peça (pç)</SelectItem>
                                      <SelectItem value="sc">Saco</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                           </div>
                         )}

                         {newProduct.packageQty > 1 && (
                           <div className="bg-[#fdd700]/20 p-4 rounded-lg border border-[#fdd700]/40 flex flex-col gap-2">
                              <p className="text-sm font-medium text-[#01034a]">Visualização da venda para o cliente:</p>
                              <p className="text-xs text-gray-600">O cliente só poderá comprar múltiplos de {newProduct.packageQty} unidades no carrinho.</p>
                              <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4].map(mult => (
                                  <Badge key={mult} variant={mult === 1 ? "default" : "outline"} className={mult === 1 ? "bg-[#01034a]" : "bg-white"}>
                                    {newProduct.packageQty * mult}
                                  </Badge>
                                ))}
                                <span className="text-gray-400 self-center">...</span>
                              </div>
                              {newProduct.price && (
                                <p className="text-sm font-bold text-[#01034a] mt-2 pt-2 border-t border-[#fdd700]/30">
                                  Preço total da embalagem: R$ {(parseFloat(newProduct.price.replace(',', '.')) * newProduct.packageQty).toFixed(2).replace('.', ',')}
                                </p>
                              )}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                   {/* Estoque e Visibilidade */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                       <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2">
                         <span className="text-xl">📦</span>
                         <span className="uppercase tracking-wider text-sm">Controle de Estoque</span>
                       </div>
                       
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="control-stock" className="font-medium text-gray-700 cursor-pointer">Gerenciar estoque deste produto</Label>
                            <Switch id="control-stock" defaultChecked />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="stock" className="text-sm text-gray-600">Qtd. em Estoque (un.)</Label>
                              <div className="relative">
                                <Archive className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                  id="stock" 
                                  type="number" 
                                  value={newProduct.stock}
                                  onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value) || 0})}
                                  className="bg-gray-50 h-10 border-gray-200 pl-9" 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="min-stock" className="text-sm text-gray-600">Estoque Mínimo</Label>
                              <div className="relative">
                                <Bell className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input id="min-stock" type="number" defaultValue="10" className="bg-gray-50 h-10 border-gray-200 pl-9" />
                              </div>
                            </div>
                         </div>
                         
                         {newProduct.stock > 0 && newProduct.packageQty > 1 && (
                            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              O estoque atual rende <strong>{Math.floor(newProduct.stock / newProduct.packageQty)}</strong> embalagens completas de venda.
                            </p>
                         )}

                         <div className="flex items-center justify-between pt-2">
                            <Label htmlFor="allow-backorder" className="text-sm text-gray-600 cursor-pointer">Permitir venda sem estoque</Label>
                            <Switch id="allow-backorder" />
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2">
                         <span className="text-xl">👁️</span>
                         <span className="uppercase tracking-wider text-sm">Visibilidade</span>
                       </div>
                       
                       <div className="space-y-6">
                         <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                            <div>
                               <Label htmlFor="status-active" className="font-medium text-[#01034a] cursor-pointer block">Produto Ativo na Loja</Label>
                               <span className="text-xs text-gray-500">Se desativado, não aparecerá para clientes.</span>
                            </div>
                            <Switch 
                              id="status-active" 
                              checked={newProduct.status}
                              onCheckedChange={(checked) => setNewProduct({...newProduct, status: checked})} 
                            />
                         </div>
                         
                         <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div>
                               <Label htmlFor="status-featured" className="font-medium text-gray-700 cursor-pointer block">Produto em Destaque</Label>
                               <span className="text-xs text-gray-500">Aparecerá na página inicial da loja.</span>
                            </div>
                            <Switch id="status-featured" />
                         </div>

                         <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div>
                               <Label htmlFor="status-new" className="font-medium text-gray-700 cursor-pointer block">Selo de Novidade</Label>
                               <span className="text-xs text-gray-500">Exibe uma tag "Novo" sobre a foto.</span>
                            </div>
                            <Switch id="status-new" defaultChecked />
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Footer Actions */}
                   <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                     <Button variant="outline" onClick={() => setActiveTab('products')} className="rounded-xl h-12 px-8 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                       Cancelar
                     </Button>
                     <Button onClick={handleAddProduct} className="bg-[#01034a] text-white hover:bg-[#01034a]/90 font-bold rounded-xl h-12 px-10 shadow-lg shadow-[#01034a]/20">
                       {editingProductId ? "Atualizar Produto" : "Salvar Produto"}
                     </Button>
                   </div>
                 </div>
               </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
               <Card className="border-none shadow-xl rounded-3xl bg-white flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-muted/30 p-6 rounded-full mb-4">
                     <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold text-[#01034a]">Gestão de Pedidos</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mt-2">
                     Acompanhe o fluxo de pedidos desde a aprovação até a entrega. Módulo em desenvolvimento.
                  </p>
               </Card>
            </TabsContent>

            <TabsContent value="integracoes" className="mt-0 space-y-0">
              <BlingTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
               <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white max-w-4xl mx-auto relative">
                 {/* Mascote no canto superior direito */}
                 <div className="absolute right-0 top-0 w-32 h-32 hidden md:block" style={{ zIndex: 10 }}>
                   <img 
                     src="/mascot.png" 
                     alt="Mascote TheTeo" 
                     className="w-full h-full object-contain object-bottom drop-shadow-xl translate-y-2 -translate-x-2"
                   />
                 </div>

                 <div className="bg-[#01034a] p-8 text-white relative z-0">
                   <h2 className="font-display text-2xl font-bold text-[#fdd700] md:pr-24">Configurações</h2>
                   <p className="text-white/70 mt-1 md:pr-24">Gerencie os parâmetros gerais da plataforma B2B.</p>
                 </div>
                 
                 <div className="p-8 space-y-8">
                   <div className="space-y-6">
                     <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2 mb-6">
                       <Settings className="h-5 w-5 text-[#fdd700]" />
                       <span className="uppercase tracking-wider text-sm">Parâmetros Comerciais</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label htmlFor="min-order" className="font-medium text-gray-700">Pedido Mínimo (R$)</Label>
                         <div className="relative">
                           <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input 
                            id="min-order" 
                            defaultValue="600,00" 
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" 
                          />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="free-shipping" className="font-medium text-gray-700">Frete Grátis Acima de (R$)</Label>
                         <div className="relative">
                           <Truck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                           <Input 
                            id="free-shipping" 
                            defaultValue="2000,00" 
                            className="bg-gray-50 pl-10 h-12 border-gray-200 focus:border-[#01034a] focus:bg-white transition-all rounded-lg" 
                          />
                         </div>
                       </div>
                     </div>

                     <div className="flex items-center gap-2 text-[#01034a] font-bold border-b pb-2 mb-6 pt-6">
                       <Settings className="h-5 w-5 text-[#fdd700]" />
                       <span className="uppercase tracking-wider text-sm">Integrações</span>
                     </div>

                     <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border border-gray-100 text-center">
                       <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                         <Settings className="h-8 w-8 text-gray-400" />
                       </div>
                       <h4 className="font-bold text-[#01034a] mb-1">Nenhuma integração ativa</h4>
                       <p className="text-sm text-gray-500 max-w-md">
                         O sistema não possui nenhuma integração configurada com ERPs ou gateways de pagamento no momento.
                       </p>
                     </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-4 border-t">
                     <Button className="bg-[#01034a] text-white hover:bg-[#01034a]/90 font-bold rounded-xl h-12 px-8 shadow-lg shadow-[#01034a]/20">
                       Salvar Alterações
                     </Button>
                   </div>
                 </div>
               </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </Layout>
  );
}
