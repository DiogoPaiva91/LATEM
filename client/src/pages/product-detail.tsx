import { Layout } from "@/components/layout";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/cart-context";
import { Category } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Check, ShieldCheck, Truck } from "lucide-react";
import NotFound from "@/pages/not-found";
import { ProductCard } from "@/components/product-card";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const { addToCart } = useCart();

  if (!match) return <NotFound />;

  const productId = parseInt(params.id);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (productLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!product) return <NotFound />;

  const category = categories.find(c => c.id === product.categoryId);

  const relatedProducts = allProducts
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link> / 
          <Link href="/catalog" className="hover:text-primary mx-1">Catálogo</Link> / 
          <span className="text-primary font-medium mx-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery Mockup */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden border">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg border overflow-hidden cursor-pointer hover:border-primary transition-colors">
                  <img src={product.image} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge variant="outline" className="mb-4 uppercase tracking-wider">{category?.name || "Geral"}</Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-sm text-muted-foreground line-through">R$ {((product.price / 100) * 1.2).toFixed(2)}</span>
              <span className="text-4xl font-bold text-primary">R$ {(product.price / 100).toFixed(2)}</span>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl mb-8 border border-primary/10">
              <div className="flex items-start gap-3 mb-4">
                <Truck className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-primary">Frete Grátis para São Paulo</h4>
                  <p className="text-xs text-muted-foreground">Em pedidos acima de R$ 600,00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-primary">Garantia de 12 meses</h4>
                  <p className="text-xs text-muted-foreground">Direto com o fabricante</p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 rounded-full mb-8"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-5 w-5" /> Adicionar ao Carrinho
            </Button>

            <Separator className="mb-8" />

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || "Ideal para uso profissional e doméstico. Alta durabilidade e resistência. Produto certificado e com garantia de qualidade."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Especificações Técnicas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground font-medium">{key}</span>
                      <span className="font-semibold text-primary">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground font-medium">SKU</span>
                    <span className="font-semibold text-primary">{product.id.toString().padStart(6, '0')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
