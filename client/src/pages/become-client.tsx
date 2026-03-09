import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Truck, CreditCard, Percent, ArrowRight, Building2, Store, Users } from "lucide-react";
import { Link } from "wouter";

export default function BecomeClient() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-[#01034a] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-primary/40 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Badge className="bg-secondary text-secondary-foreground mb-6 px-6 py-2 text-sm font-bold rounded-full animate-fade-in">
            EXCLUSIVO PARA CNPJ
          </Badge>
          
          <h1 className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
            Abasteça seu negócio com <span className="text-secondary">preço de fábrica</span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
            A Lá Tem Costa Marta é a parceira ideal para construtoras, depósitos e lojas de material de construção.
            Cadastre-se e tenha acesso a condições especiais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-16 px-10 text-xl font-bold rounded-2xl shadow-[0_0_20px_rgba(253,215,0,0.3)] hover:scale-105 transition-all">
              <Link href="/register">Cadastrar Minha Empresa</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 h-16 px-10 text-xl font-bold rounded-2xl">
              <Link href="/contact">Falar com Consultor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">
              Vantagens de ser cliente Lá Tem
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Desenvolvemos soluções pensadas especificamente para o dia a dia do varejo e da construção civil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-muted/30">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm mb-6">
                  <Percent className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl text-primary mb-3">Preço de Atacado</h3>
                <p className="text-muted-foreground">Margens competitivas para você lucrar mais na revenda.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-muted/30">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm mb-6">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl text-primary mb-3">Logística Própria</h3>
                <p className="text-muted-foreground">Entregas ágeis e programadas para não parar sua obra ou loja.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-muted/30">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm mb-6">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl text-primary mb-3">Faturamento B2B</h3>
                <p className="text-muted-foreground">Prazos flexíveis no boleto e aceitação de cartão BNDES.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-muted/30">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl text-primary mb-3">Mix Completo</h3>
                <p className="text-muted-foreground">Mais de 10 mil itens das principais marcas do mercado.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 hover:border-secondary/50 transition-colors group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors mb-6">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-4">Lojas de Material</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Reposição rápida de estoque</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Mix ideal para seu ponto de venda</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Material de merchandising</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 hover:border-secondary/50 transition-colors group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors mb-6">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-4">Construtoras</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Cotações para grandes volumes</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Entregas fracionadas na obra</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Atendimento técnico especializado</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 hover:border-secondary/50 transition-colors group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-4">Empreiteiros</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Facilidade de pagamento</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Tudo em um só lugar</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span>Programa de fidelidade</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Junte-se a mais de 5.000 parceiros que confiam na Lá Tem Costa Marta para abastecer seus empreendimentos.
            </p>
            <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-16 px-12 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-all">
              <Link href="/register">
                Quero ser Cliente <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <p className="mt-6 text-sm text-white/50">
              Cadastro sujeito a análise de crédito. Aprovação em até 24h úteis.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
