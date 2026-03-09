import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard } from "lucide-react";

export default function ClientArea() {
  const [activeTab, setActiveTab] = useState<"pedidos" | "perfil">("pedidos");

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[80vh] py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-display font-bold text-primary mb-8" data-testid="text-client-title">
              Área do Cliente
            </h1>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Menu */}
              <aside className="w-full md:w-64 shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                  <div className="p-6 bg-primary/5 border-b border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      JD
                    </div>
                    <div>
                      <p className="font-bold text-primary" data-testid="text-client-name">João da Silva</p>
                      <p className="text-xs text-muted-foreground">joao@exemplo.com.br</p>
                    </div>
                  </div>
                  
                  <nav className="p-3 space-y-1">
                    <button
                      onClick={() => setActiveTab("pedidos")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                        activeTab === "pedidos" 
                          ? "bg-secondary/15 text-primary font-bold" 
                          : "hover:bg-muted text-muted-foreground hover:text-primary"
                      }`}
                      data-testid="tab-pedidos"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5" />
                        Meus Pedidos
                      </div>
                      {activeTab === "pedidos" && <ChevronRight className="h-4 w-4 text-secondary" />}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("perfil")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                        activeTab === "perfil" 
                          ? "bg-secondary/15 text-primary font-bold" 
                          : "hover:bg-muted text-muted-foreground hover:text-primary"
                      }`}
                      data-testid="tab-perfil"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        Meu Perfil
                      </div>
                      {activeTab === "perfil" && <ChevronRight className="h-4 w-4 text-secondary" />}
                    </button>

                    <div className="my-2 border-t border-border mx-4"></div>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left"
                      data-testid="button-logout"
                    >
                      <LogOut className="h-5 w-5" />
                      Sair da conta
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                {activeTab === "pedidos" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="section-pedidos">
                    <h2 className="text-2xl font-display font-bold text-primary">Meus Pedidos</h2>
                    
                    {/* Pedido Mock 1 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-primary/10">
                        <div>
                          <p className="text-sm text-muted-foreground">Pedido #98234</p>
                          <p className="font-bold text-primary mt-1">Realizado em 20/02/2026</p>
                        </div>
                        <div className="flex flex-col md:items-end">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider w-fit">
                            Entregue
                          </span>
                          <p className="font-bold text-primary mt-2">R$ 489,80</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center p-2">
                            <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=200" alt="Produto" className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <p className="font-medium text-primary">Furadeira de Impacto Profissional 650W</p>
                            <p className="text-sm text-muted-foreground">Quantidade: 1</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center p-2">
                            <img src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=200" alt="Produto" className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <p className="font-medium text-primary">Kit Chaves de Fenda e Phillips (10 Peças)</p>
                            <p className="text-sm text-muted-foreground">Quantidade: 2</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-primary/10 flex justify-end">
                        <Button variant="outline" className="rounded-xl">Comprar Novamente</Button>
                      </div>
                    </div>

                    {/* Pedido Mock 2 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-primary/10">
                        <div>
                          <p className="text-sm text-muted-foreground">Pedido #98102</p>
                          <p className="font-bold text-primary mt-1">Realizado em 15/01/2026</p>
                        </div>
                        <div className="flex flex-col md:items-end">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider w-fit">
                            Entregue
                          </span>
                          <p className="font-bold text-primary mt-2">R$ 1.250,00</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center p-2">
                            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200" alt="Produto" className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <p className="font-medium text-primary">Cimento CP-II 50kg</p>
                            <p className="text-sm text-muted-foreground">Quantidade: 20</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-primary/10 flex justify-end">
                        <Button variant="outline" className="rounded-xl">Comprar Novamente</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "perfil" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="section-perfil">
                    <h2 className="text-2xl font-display font-bold text-primary">Meu Perfil</h2>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                      <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-[#0B132B]">
                        <h3 className="font-bold text-[#fdd700] flex items-center gap-2">
                          <User className="h-5 w-5" /> Informações Jurídicas
                        </h3>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">CNPJ</p>
                          <div className="flex gap-2 relative">
                            <Input defaultValue="00.000.000/0001-00" className="bg-white border-gray-200 text-gray-900 shadow-sm pl-10 relative z-0" readOnly />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">Razão Social</p>
                          <div className="flex gap-2 relative">
                            <Input defaultValue="Nome Jurídico da Empresa" className="bg-white border-gray-200 text-gray-900 shadow-sm pl-10 relative z-0" readOnly />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-primary mb-1">Nome da Loja</p>
                          <div className="flex gap-2 relative">
                            <Input defaultValue="Nome da Loja" className="bg-white border-gray-200 text-gray-900 shadow-sm pl-10 relative z-0" readOnly />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-2.205a2 2 0 0 1 1.79 0L12 7l3.8-1.9a2 2 0 0 1 1.79 0L22 7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"/><path d="M12 7v13"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                      <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-[#0B132B]">
                        <h3 className="font-bold text-[#fdd700] flex items-center gap-2">
                          <MapPin className="h-5 w-5" /> Endereço da Loja Física
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-primary mb-1">Buscar Endereço</p>
                          <div className="flex gap-2 relative">
                            <Input placeholder="Digite para buscar no Google Maps..." className="pl-10 bg-white border border-gray-200 text-gray-900 shadow-sm relative z-0" />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Nós preencheremos os detalhes automaticamente.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                      <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-[#0B132B]">
                        <h3 className="font-bold text-[#fdd700] flex items-center gap-2">
                          <User className="h-5 w-5" /> Contato e Acesso
                        </h3>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">Nome do Responsável</p>
                          <div className="flex gap-2 relative">
                            <Input placeholder="Seu nome completo" defaultValue="Seu nome completo" className="pl-10 bg-white border border-gray-200 text-gray-900 shadow-sm relative z-0" />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">Celular / WhatsApp</p>
                          <div className="flex gap-2 relative">
                            <Input defaultValue="(11) 99999-9999" className="pl-10 bg-white border border-gray-200 text-gray-900 shadow-sm relative z-0" />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-primary mb-1">E-mail Comercial</p>
                          <div className="flex gap-2 relative">
                            <Input defaultValue="compras@suaempresa.com.br" className="pl-10 bg-white border border-gray-200 text-gray-900 shadow-sm relative z-0" />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">Senha</p>
                          <div className="flex gap-2 relative">
                            <Input type="password" placeholder="••••••••" className="pl-10 bg-white border border-gray-200 text-gray-900 shadow-sm relative z-0" />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">Confirmar Senha</p>
                          <div className="flex gap-2 relative">
                            <Input type="password" placeholder="••••••••" className="pl-10 bg-white border border-gray-200 text-gray-900 shadow-sm relative z-0" />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}