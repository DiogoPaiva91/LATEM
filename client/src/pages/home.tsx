import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Product } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, CreditCard, ShieldCheck, PhoneCall } from "lucide-react";
import { Link } from "wouter";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({ 
    queryKey: ["/api/products"] 
  });

  const parentCategories = categories.filter(c => c.parentId === null);

  return (
    <Layout>
      {/* Hero Section - New Layout */}
      <section className="relative bg-[#01034a] py-20 md:py-32">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"></div>
        
        {/* Floating Particles/Glows */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-secondary/50 rounded-full animate-bounce duration-[3000ms]"></div>
        <div className="absolute top-40 right-1/4 w-1.5 h-1.5 bg-secondary/30 rounded-full animate-ping"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          

          {/* Main Headline */}
          <h1 className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-6 px-4">
            Precisou? <span className="text-secondary">Lá tem</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-4xl text-lg md:text-[33px] mb-10 px-6 font-extrabold text-[#fafafa] leading-snug">
            O fornecedor onde seu depósito ou loja de materiais de construção encontra tudo em um só lugar
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
            <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-all font-bold h-14 px-8 text-lg rounded-xl shadow-[0_0_20px_rgba(253,215,0,0.3)]">
              <Link href="/catalog">Ver produtos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg rounded-xl backdrop-blur-sm">
              <Link href="/contact">Fale conosco</Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-20 text-center border-t border-white/10 pt-8 px-4 md:px-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-display font-bold text-white mb-1">+10 mil</span>
              <span className="text-[10px] md:text-sm text-white/50 uppercase tracking-wider">Produtos disponíveis</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10 px-4 md:px-20">
              <span className="text-2xl md:text-4xl font-display font-bold text-secondary mb-1">R$ 600</span>
              <span className="text-[10px] md:text-sm text-white/50 uppercase tracking-wider">Pedido mínimo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-display font-bold text-secondary mb-1">100%</span>
              <span className="text-[10px] md:text-sm text-white/50 uppercase tracking-wider">Atacado</span>
            </div>
          </div>
        </div>

        {/* Mascot Image - Integrated nicely */}
        <img 
          src="/mascot.png" 
          alt="Mascote Lá Tem" 
          className="absolute bottom-0 -right-8 w-40 opacity-30 md:w-96 md:right-10 md:-bottom-10 md:opacity-90 object-contain drop-shadow-2xl hover:opacity-100 transition-opacity hover:scale-105 duration-500 z-0 pointer-events-none"
        />
      </section>
      {/* Features Bar */}
      <section className="bg-white border-y py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Entrega Rápida</h4>
                <p className="text-xs text-muted-foreground">Frota própria para toda região</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Pagamento Flexível</h4>
                <p className="text-xs text-muted-foreground">Boleto, PIX e Cartão BNDES</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Compra Segura</h4>
                <p className="text-xs text-muted-foreground">Seus dados protegidos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Suporte Dedicado</h4>
                <p className="text-xs text-muted-foreground">Equipe especializada para te atender</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-primary">Categorias</h2>
              <p className="text-muted-foreground mt-2">Encontre tudo o que precisa para sua obra</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/catalog">Ver Todas</Link>
            </Button>
          </div>

          <div className="flex overflow-x-auto pb-6 gap-3 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style dangerouslySetInnerHTML={{
              __html: ".hide-scrollbar::-webkit-scrollbar{display:none}"
            }} />
            {categoriesLoading ? (
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="min-w-[130px] h-[160px] bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : parentCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="min-w-[130px] max-w-[130px] md:min-w-[150px] md:max-w-[150px] shrink-0 snap-start"
                data-testid={`link-category-${cat.id}`}
              >
                <div className="group cursor-pointer" data-testid={`card-category-${cat.id}`}>
                  <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-primary/5 relative mb-2 flex items-center justify-center p-2" data-testid={`img-category-${cat.id}`}>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors z-10" />
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{cat.icon || "📦"}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-center text-sm md:text-base text-primary group-hover:text-secondary transition-colors leading-tight" data-testid={`text-category-${cat.id}`}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-display font-bold text-primary mb-2">Destaques da Semana</h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full mx-auto md:mx-0"></div>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold hover:text-secondary hover:bg-transparent text-lg group">
              <Link href="/catalog" className="flex items-center">
                Ver Catálogo Completo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
              ))
            ) : products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      {/* Brand Values / Why Us Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
              <img 
                src="/warehouse-hero-v2.jpg" 
                alt="Centro de Distribuição Lá Tem" 
                className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-2xl shadow-xl z-20 hidden md:block">
                <p className="text-secondary text-4xl font-black font-display mb-1">15+</p>
                <p className="text-white text-xs uppercase tracking-widest font-bold">Anos de Mercado</p>
              </div>
            </div>
            <div className="space-y-8">
              <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 px-4 py-1.5 text-xs font-bold tracking-widest uppercase border-none">
                Por que a Lá Tem?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary leading-tight">
                Qualidade de ponta para <br className="hidden md:block" />
                quem constrói o futuro
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missão é facilitar o dia a dia do lojista e do construtor, entregando não apenas produtos, mas soluções completas em materiais de construção.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1 text-base">Garantia Total</h4>
                    <p className="text-sm text-muted-foreground">Produtos certificados pelas melhores marcas.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1 text-base">Logística Ágil</h4>
                    <p className="text-sm text-muted-foreground">Entrega em até 48h para toda a região.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-blue-900 opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-secondary text-secondary-foreground mb-8 px-6 py-2 text-sm font-bold rounded-full animate-bounce">
            PARCERIA B2B
          </Badge>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight max-w-4xl mx-auto text-[#ffffff]">
            Impulsione seu negócio com <br className="hidden md:block" />
            preços diretos de <span className="text-secondary">fábrica</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Cadastre seu CNPJ agora e tenha acesso imediato a condições exclusivas de faturamento, frete grátis e suporte especializado.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-16 px-10 text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all group">
               Cadastrar minha Loja
               <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
             </Button>
             <Button size="lg" variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10 h-16 px-10 text-xl font-bold rounded-2xl backdrop-blur-sm">
               Falar com Consultor
             </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
