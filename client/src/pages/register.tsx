import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Building2, User, Percent, Truck, CheckCircle2, FileText, ArrowRight, Store, Smartphone, Mail, Lock, MapPin } from "lucide-react";
import { useState } from "react";

export default function Register() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/login");
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12 px-4 relative">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 md:top-8 md:left-8 gap-2 text-muted-foreground hover:text-primary"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para o site
        </Button>

        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
             <h1 className="text-4xl font-display font-bold text-primary mb-2">Cadastre sua Loja</h1>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Junte-se a milhares de lojistas que compram com as melhores condições na Lá tem Costa Marta.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Benefits Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-primary text-white border-none shadow-lg overflow-visible relative">
                
                <div className="absolute -top-16 -right-4 w-40 h-40 z-20 pointer-events-none flex items-end justify-center">
                   <img src="/mascot.png" alt="TheTeo" className="w-full h-full object-contain drop-shadow-xl" />
                </div>

                <CardContent className="p-8 relative z-10 space-y-6 pt-16">
                  <div>
                    <h3 className="text-xl font-bold font-display text-secondary mb-2">Por que cadastrar?</h3>
                    <p className="text-white/80 text-sm">Vantagens exclusivas para parceiros B2B.</p>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                        <Percent className="h-4 w-4" />
                      </div>
                      <span className="mt-1.5">Preços de atacado exclusivos</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                        <Truck className="h-4 w-4" />
                      </div>
                      <span className="mt-1.5">Entrega em 24h para SP</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="mt-1.5">Pagamento facilitado no Boleto</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="mt-1.5">Mix completo de produtos</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-2">Já é parceiro?</p>
                    <Button variant="secondary" className="w-full font-bold" onClick={() => setLocation("/login")}>
                      Fazer Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-3">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-white border-b px-8 py-6">
                  <CardTitle className="text-xl font-display text-primary">Dados da Empresa</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleRegister} className="space-y-8">
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 mb-4">
                        <Building2 className="h-5 w-5 text-secondary" />
                        Informações Jurídicas
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cnpj">CNPJ</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="cnpj" placeholder="00.000.000/0001-00" required className="bg-muted/30 pl-10" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="razao">Razão Social</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input id="razao" placeholder="Nome Jurídico da Empresa" required className="bg-muted/30 pl-10" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fantasia">Nome da Loja</Label>
                        <div className="relative">
                          <Store className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input id="fantasia" placeholder="Nome da Loja" required className="bg-muted/30 pl-10" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 mb-4">
                        <MapPin className="h-5 w-5 text-secondary" />
                        Endereço da Loja Física
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endereco_google">Buscar Endereço</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input 
                            id="endereco_google" 
                            placeholder="Digite para buscar no Google Maps..." 
                            required 
                            className="bg-muted/30 pl-10 h-12" 
                          />
                          {/* Visual cue for Google Maps integration mockup */}
                          <div className="absolute right-3 top-3 pointer-events-none opacity-50">
                             <span className="text-[10px] font-bold text-muted-foreground border border-muted-foreground/30 px-1 rounded bg-white">Google</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Nós preencheremos os detalhes automaticamente.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 mb-4">
                        <User className="h-5 w-5 text-secondary" />
                        Contato e Acesso
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="responsavel">Nome do Responsável</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="responsavel" placeholder="Seu nome completo" required className="bg-muted/30 pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="celular">Celular / WhatsApp</Label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="celular" placeholder="(11) 99999-9999" required className="bg-muted/30 pl-10" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail Comercial</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="compras@suaempresa.com.br" required className="bg-muted/30 pl-10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="senha">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="senha" type="password" required className="bg-muted/30 pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirma_senha">Confirmar Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="confirma_senha" type="password" required className="bg-muted/30 pl-10" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                        Declaro que sou lojista e concordo com a <Link href="/privacy" className="text-primary hover:underline">Política de Privacidade</Link> e <Link href="/terms" className="text-primary hover:underline">Termos de Uso</Link>.
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary hover:text-primary transition-all duration-300" disabled={isLoading}>
                      {isLoading ? "Processando..." : "Finalizar Cadastro"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
