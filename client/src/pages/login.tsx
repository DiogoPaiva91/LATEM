import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { LogIn, ArrowLeft, Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/admin"); // For demo purposes, go to admin
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12 px-4 relative">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 md:top-8 md:left-8 gap-2 text-muted-foreground hover:text-primary"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para o site
        </Button>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-display font-bold text-primary">Bem-vindo de volta!</h1>
             <p className="text-muted-foreground mt-2">Acesse sua conta para fazer pedidos.</p>
          </div>

          <Card className="border-none shadow-xl rounded-3xl overflow-visible relative">
            
            <CardHeader className="bg-primary text-white p-8 pb-10 relative overflow-visible rounded-t-3xl z-10">
               
               <div className="relative z-10 flex flex-col items-start text-left max-w-[65%]">
                 <CardTitle className="text-3xl font-display font-bold mb-2 text-secondary">Login</CardTitle>
                 <CardDescription className="text-white/80 text-base leading-relaxed">
                    Olá! Eu sou o <strong className="text-secondary">TheTeo</strong>. Vamos acessar sua área exclusiva?
                 </CardDescription>
               </div>

               <img 
                 src="/mascot.png" 
                 alt="TheTeo" 
                 className="absolute -bottom-4 right-4 w-40 h-auto object-contain drop-shadow-xl z-20" 
               />
            </CardHeader>
            <CardContent className="p-8 pt-10 -mt-4 bg-white rounded-t-3xl relative z-0">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="seu@email.com.br" required className="h-12 pl-10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="/forgot-password" className="text-xs text-primary font-bold hover:underline hover:text-secondary transition-colors">Esqueceu a senha?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="password" type="password" required className="h-12 pl-10 rounded-xl" />
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300" disabled={isLoading}>
                  {isLoading ? "Entrando..." : (
                    <span className="flex items-center gap-2">
                      Entrar <LogIn className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t text-center space-y-4">
                <p className="text-sm text-muted-foreground">Não tem uma conta?</p>
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-primary/10 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/20" onClick={() => setLocation("/register")}>
                  Cadastrar minha loja
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
