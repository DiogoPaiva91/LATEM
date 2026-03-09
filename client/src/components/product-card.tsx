import { Product, useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link } from "wouter";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { data: categories = [] } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });

  const category = categories.find(c => c.id === product.categoryId);

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow flex flex-col h-full bg-card">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-muted overflow-hidden cursor-pointer">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </Link>
      
      <CardContent className="p-4 flex-1 flex flex-col gap-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          {category?.name || "Geral"}
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-primary line-clamp-2 min-h-[3rem] group-hover:text-primary/80 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-3">
        <div className="w-full flex items-end gap-1">
          <span className="text-xs text-muted-foreground mb-1">R$</span>
          <span className="text-2xl font-bold text-primary">{(product.price / 100).toFixed(2)}</span>
          <span className="text-xs text-muted-foreground mb-1 ml-auto">unidade</span>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
