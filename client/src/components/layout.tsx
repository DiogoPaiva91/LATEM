import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, Phone, Mail, X, LogIn, UserPlus, ChevronDown, ShieldCheck, MapPin, Facebook, Instagram, Linkedin, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { cartCount, items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [location, setLocation] = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setLocation("/checkout");
  };

  const isMinimalLayout = location.startsWith("/login") || location.startsWith("/register") || location.startsWith("/admin") || location.startsWith("/faq");

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Top Bar */}
      {!isMinimalLayout && (
        <div className="bg-primary text-primary-foreground py-2 text-xs md:text-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> (11) 9999-9999</span>
              <span className="flex items-center gap-1 hidden sm:flex"><Mail className="h-3 w-3" /> contato@latematacadista.com.br</span>
            </div>
            <div className="flex gap-4 font-medium">
              <Link href="/admin" className="text-secondary/80 hover:text-secondary transition-colors text-[10px] uppercase border border-secondary/20 px-2 rounded flex items-center bg-secondary/5" data-testid="link-admin">Admin (Dev)</Link>
              <Link href="/client-area" className="hover:text-secondary transition-colors cursor-pointer" data-testid="link-client-area">Área do Cliente</Link>
              <Link href="/faq" className="hover:text-secondary transition-colors" data-testid="link-faq">Dúvidas</Link>
            </div>
          </div>
        </div>
      )}
      {/* Main Header */}
      {!isMinimalLayout && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img src="/logo.png" alt="Lá tem Costa Marta" className="h-16 md:h-24 w-auto object-contain" />
              </Link>

              {/* Desktop Search */}
              <div className="hidden md:flex flex-1 max-w-2xl relative">
                <Input 
                  placeholder="O que você procura hoje? (Ex: Cimento, Furadeira...)" 
                  className="w-full pl-4 pr-12 rounded-full border-primary/20 focus-visible:ring-primary h-12 bg-muted/30"
                />
                <Button size="icon" className="absolute right-1 top-1 rounded-full h-10 w-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 hover:text-secondary hover:bg-white/5 font-medium">
                      <User className="h-5 w-5 text-secondary" />
                      <div className="flex flex-col items-start text-xs leading-none">
                        <span className="opacity-70">Olá, visitante</span>
                        <span className="font-bold">Entre ou Cadastre-se</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <button 
                      onClick={() => setIsAuthOpen(false)} 
                      className="absolute right-4 top-4 z-50 text-white/70 hover:text-white transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <div className="bg-primary pt-6 pb-10 px-8 text-center text-white relative overflow-visible z-10">
                      
                      <div className="relative z-10 flex flex-col items-start text-left max-w-[65%]">
                        <DialogTitle className="text-3xl font-display font-bold mb-2 text-secondary">Login</DialogTitle>
                        <DialogDescription className="text-white/80 text-base leading-relaxed">
                          Olá! Eu sou o <strong className="text-secondary">TheTeo</strong>. Vamos acessar sua área exclusiva?
                        </DialogDescription>
                      </div>

                      <img 
                        src="/mascot.png" 
                        alt="TheTeo" 
                        className="absolute -bottom-4 right-4 w-40 h-auto object-contain drop-shadow-xl z-20" 
                      />
                    </div>
                    
                    <div className="p-8 pt-6 space-y-4 bg-white relative z-0">
                      <Button 
                        className="w-full h-14 text-lg font-bold rounded-xl gap-3 hover:bg-secondary hover:text-primary transition-all duration-300" 
                        onClick={() => {
                          setIsAuthOpen(false);
                          setLocation("/login");
                        }}
                      >
                        <LogIn className="h-5 w-5" />
                        Fazer Login
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">ou</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full h-14 text-lg font-bold rounded-xl gap-3 border-2 border-primary/10 hover:bg-muted/30 hover:text-primary hover:border-primary/30"
                        onClick={() => {
                          setIsAuthOpen(false);
                          setLocation("/register"); // Or whatever the registration path is, user asked for "Não possui cadastro?"
                        }}
                      >
                        <UserPlus className="h-5 w-5" />
                        Não possui cadastro?
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-6 w-6 text-primary" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground hover:bg-secondary rounded-full">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="text-xl font-display text-primary">Seu Carrinho</SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-hidden py-4">
                      {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                          <ShoppingCart className="h-16 w-16 opacity-20" />
                          <p>Seu carrinho está vazio</p>
                          <Button onClick={() => setIsCartOpen(false)} variant="outline">Continuar Comprando</Button>
                        </div>
                      ) : (
                        <ScrollArea className="h-full pr-4">
                          <div className="space-y-4">
                            {items.map((item) => (
                              <div key={item.id} className="flex gap-4 border-b pb-4">
                                <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                                  <p className="text-sm font-bold text-primary">R$ {item.price.toFixed(2)}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="h-6 w-6" 
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      -
                                    </Button>
                                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="h-6 w-6" 
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 ml-auto text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="pt-4 border-t space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold text-primary">
                          <span>Total</span>
                          <span>R$ {cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Pedido mínimo: R$ 600,00
                          {cartTotal < 600 && <span className="text-destructive block font-medium">Faltam R$ {(600 - cartTotal).toFixed(2)}</span>}
                        </p>
                        <Button 
                          className="w-full h-12 text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          disabled={cartTotal < 600}
                          onClick={handleCheckout}
                        >
                          Finalizar Pedido
                        </Button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>

                {/* Mobile Menu Trigger */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-6 w-6 text-primary" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[80vw] sm:max-w-xs p-0 flex flex-col bg-white">
                    <div className="bg-primary p-6 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
                       <img src="/logo.png" alt="Lá tem" className="h-12 brightness-0 invert opacity-90 relative z-10" />
                       <div className="mt-4 flex items-center gap-3 relative z-10">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                             <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex flex-col text-white">
                             <span className="text-xs opacity-70">Bem-vindo</span>
                             <span className="font-bold text-sm" onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}>Entre ou Cadastre-se</span>
                          </div>
                       </div>
                    </div>
                    
                    <ScrollArea className="flex-1 py-4">
                      <div className="flex flex-col px-4 space-y-2">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted text-primary font-medium">
                          Home
                        </Link>
                        <div className="space-y-1">
                          <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mt-2">Categorias</div>
                          <Link href="/catalog?category=eletrica" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground/80">Elétrica</Link>
                          <Link href="/catalog?category=hidraulica" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground/80">Hidráulica</Link>
                          <Link href="/catalog?category=ferramentas" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground/80">Ferramentas</Link>
                          <Link href="/catalog?category=tintas" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground/80">Pintura</Link>
                          <Link href="/catalog?category=pisos" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground/80">Pisos e Revestimentos</Link>
                        </div>
                        <Separator className="my-2" />
                        <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted text-primary font-medium">
                          Todos os Produtos
                        </Link>
                        <Link href="/become-client" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted text-primary font-medium">
                          Seja Cliente
                        </Link>
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t bg-muted/20">
                      <div className="space-y-3">
                         <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary">
                            <Phone className="h-4 w-4" /> Fale Conosco
                         </Link>
                         <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary">
                            <ShieldCheck className="h-4 w-4" /> Central de Ajuda
                         </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Mobile Search */}
            <div className="mt-4 md:hidden relative">
              <Input 
                placeholder="Buscar produtos..." 
                className="w-full pl-4 pr-12 rounded-full h-10 bg-muted/30"
              />
              <Button size="icon" className="absolute right-1 top-1 rounded-full h-8 w-8 bg-secondary text-secondary-foreground p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="bg-primary/5 border-y border-primary/10 hidden md:block">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-8 overflow-x-auto py-3 text-sm font-medium text-primary/80 scrollbar-hide">
                <Link href="/" className="hover:text-secondary whitespace-nowrap">Home</Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-secondary focus:outline-none whitespace-nowrap">
                    Categorias <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-white z-50">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/catalog?category=eletrica" className="w-full">Elétrica</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/catalog?category=hidraulica" className="w-full">Hidráulica</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/catalog?category=ferramentas" className="w-full">Ferramentas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/catalog?category=tintas" className="w-full">Pintura</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/catalog?category=pisos" className="w-full">Pisos e Revestimentos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer border-t mt-1 pt-1 font-bold text-primary">
                      <Link href="/catalog" className="w-full">Ver Todas</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/catalog" className="hover:text-secondary whitespace-nowrap">Todos os Produtos</Link>
                <Link href="/become-client" className="hover:text-secondary whitespace-nowrap text-primary font-medium">Seja Cliente</Link>
                <Link href="/contact" className="hover:text-secondary whitespace-nowrap">Sobre Nós</Link>
                
                <div className="flex-1" />
              </nav>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
      {!isMinimalLayout && (
        <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="space-y-6">
                <div>
                  <img src="/logo.png" alt="TheTeo" className="h-24 w-auto object-contain" />
                </div>
                <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed">
                  Sua parceira de confiança na distribuição de materiais de construção. Qualidade e preço justo para o seu negócio.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-display font-bold text-secondary mb-6">Institucional</h4>
                <ul className="space-y-3 text-sm text-primary-foreground/70">
                  <li><Link href="/contact" className="hover:text-secondary flex items-center gap-2 transition-colors"><span className="w-1 h-1 rounded-full bg-secondary/50"></span> Sobre Nós</Link></li>
                  <li><Link href="/careers" className="hover:text-secondary flex items-center gap-2 transition-colors"><span className="w-1 h-1 rounded-full bg-secondary/50"></span> Trabalhe Conosco</Link></li>
                  <li><Link href="/terms" className="hover:text-secondary flex items-center gap-2 transition-colors"><span className="w-1 h-1 rounded-full bg-secondary/50"></span> Termos de Uso</Link></li>
                  <li><Link href="/privacy" className="hover:text-secondary flex items-center gap-2 transition-colors"><span className="w-1 h-1 rounded-full bg-secondary/50"></span> Política de Privacidade</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-display font-bold text-secondary mb-6">Contato</h4>
                <ul className="space-y-4 text-sm text-primary-foreground/80">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" /> 
                    <span>Av. José Maria Whitaker, 2106<br/>Planalto Paulista, São Paulo - SP<br/>CEP: 04057-000</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-secondary flex-shrink-0" /> 
                    <span>(11) 9999-9999</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-secondary flex-shrink-0" /> 
                    <span>contato@latematacadista.com.br</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-display font-bold text-secondary mb-6">Formas de Pagamento</h4>
                <div className="grid grid-cols-3 gap-2 mb-6">
                   <div className="bg-white p-2 rounded flex items-center justify-center h-10 opacity-90 hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-black">PIX</span>
                   </div>
                   <div className="bg-white p-2 rounded flex items-center justify-center h-10 opacity-90 hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-black">BOLETO</span>
                   </div>
                   <div className="bg-white p-2 rounded flex items-center justify-center h-10 opacity-90 hover:opacity-100 transition-opacity">
                      <CreditCard className="h-5 w-5 text-black" />
                   </div>
                </div>
                
                <h4 className="text-lg font-display font-bold text-secondary mb-4">Segurança</h4>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-white/50 leading-none">Site</span>
                      <span className="text-xs font-bold text-white">Seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="bg-white/10 mb-8" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
              <p>© 2026 Lá tem Costa Marta. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
              <div className="flex items-center gap-2">
                <span>Desenvolvido com</span>
                <span className="font-bold text-secondary">Replit</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
