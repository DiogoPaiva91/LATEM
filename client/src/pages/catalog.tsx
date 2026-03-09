import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/cart-context";
import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useLocation, useSearch } from "wouter";
import { Filter, SlidersHorizontal, CheckCircle2, Search as SearchIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Catalog() {
  const [location] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategorySlug = searchParams.get("category");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({ 
    queryKey: ["/api/products"] 
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMode, setStatusMode] = useState<'sistema' | 'bling'>('sistema');

  const visibleCategories = useMemo(() => {
    if (statusMode === 'bling') {
      return categories.filter(c => !!c.blingId);
    }
    return categories.filter(c => c.status === 'Ativa');
  }, [categories, statusMode]);

  // Handle initial category from URL
  useMemo(() => {
    if (initialCategorySlug && visibleCategories.length > 0) {
      const cat = visibleCategories.find(c => c.slug === initialCategorySlug);
      if (cat && !selectedCategories.includes(cat.id)) {
        setSelectedCategories([cat.id]);
      }
    }
  }, [initialCategorySlug, visibleCategories]);

  const toggleCategory = (catId: number) => {
    setSelectedSubcategories([]);
    setSelectedCategories(prev =>
      prev.includes(catId)
        ? prev.filter(c => c !== catId)
        : [...prev, catId]
    );
  };

  const toggleSubcategory = (subId: number) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subId) ? prev.filter((s) => s !== subId) : [...prev, subId]
    );
  };

  const visibleCategoryIds = useMemo(() => new Set(visibleCategories.map(c => c.id)), [visibleCategories]);

  const filteredProducts = products.filter(product => {
    const inVisibleCategory = !product.categoryId || visibleCategoryIds.has(product.categoryId);
    const matchesCategory = selectedCategories.length === 0 
      ? inVisibleCategory
      : (product.categoryId && selectedCategories.includes(product.categoryId));
    const priceInReais = product.price / 100;
    const matchesPrice = priceInReais >= priceRange[0] && priceInReais <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubcategory =
      selectedSubcategories.length === 0 ||
      (product.subcategoryId && selectedSubcategories.includes(product.subcategoryId));

    return matchesCategory && matchesPrice && matchesSearch && matchesSubcategory;
  });

  const parentCategories = visibleCategories.filter(c => c.parentId === null);
  const subcategoriesByParent = useMemo(() => {
    const map: Record<number, Category[]> = {};
    visibleCategories.forEach(cat => {
      if (cat.parentId !== null) {
        if (!map[cat.parentId]) map[cat.parentId] = [];
        map[cat.parentId].push(cat);
      }
    });
    return map;
  }, [visibleCategories]);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-primary">
          <Filter className="h-5 w-5 text-secondary" /> Filtrar Catálogo
        </h3>
        
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-primary/5">
            <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider">Categorias</h4>
            <div className="flex bg-muted/40 p-1 rounded-xl mb-3 gap-1" data-testid="select-status-mode">
              <button
                type="button"
                onClick={() => { setStatusMode('sistema'); setSelectedCategories([]); setSelectedSubcategories([]); }}
                className={`flex-1 text-[11px] font-medium py-1.5 px-2 rounded-lg transition-all ${statusMode === 'sistema' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
                data-testid="button-status-mode-sistema"
              >
                Status Sistema
              </button>
              <button
                type="button"
                onClick={() => { setStatusMode('bling'); setSelectedCategories([]); setSelectedSubcategories([]); }}
                className={`flex-1 text-[11px] font-medium py-1.5 px-2 rounded-lg transition-all ${statusMode === 'bling' ? 'bg-white shadow-sm text-blue-600' : 'text-muted-foreground hover:text-primary'}`}
                data-testid="button-status-mode-bling"
              >
                Status Bling
              </button>
            </div>
            <div className="space-y-1">
              {parentCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                const categorySubcategories = subcategoriesByParent[cat.id] || [];

                return (
                  <div key={cat.id} className="flex flex-col">
                <div className={`w-full flex items-center justify-between py-0.5 px-1.5 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-primary/5' 
                    : 'bg-white hover:bg-primary/5'
                }`}>
                  <button
                    type="button"
                    className="flex-1 flex items-center group cursor-pointer text-left py-1"
                    onClick={() => toggleCategory(cat.id)}
                    data-testid={`button-filter-category-${cat.id}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-secondary border-secondary' : 'border-primary/20 group-hover:border-secondary'}`}>
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                    <span className={`ml-2 text-xs font-medium leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} data-testid={`text-filter-category-${cat.id}`}>
                      {cat.name}
                    </span>
                  </button>
                  
                  {categorySubcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-1 rounded-md transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground hover:bg-primary/10'}`}
                      data-testid={`button-toggle-subcategories-${cat.id}`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`transition-transform ${isSelected ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  )}
                </div>

                    {/* Subcategories (visible when category is selected) */}
                    {isSelected && categorySubcategories.length > 0 && (
                      <div className="ml-8 mt-1 space-y-2 border-l-2 border-primary/10 pl-3 py-1" data-testid={`section-filter-subcategories-${cat.id}`}>
                        {categorySubcategories.map((sub) => {
                          const isSubSelected = selectedSubcategories.includes(sub.id);
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              className="w-full flex items-center group cursor-pointer text-left py-1"
                              onClick={() => toggleSubcategory(sub.id)}
                              data-testid={`button-filter-subcategory-${sub.id}`}
                            >
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isSubSelected ? 'bg-secondary border-secondary' : 'border-primary/20 group-hover:border-secondary'}`}>
                                {isSubSelected && <CheckCircle2 className="h-3 w-3 text-primary" />}
                              </div>
                              <span className={`ml-3 text-xs font-medium transition-colors ${isSubSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} data-testid={`text-filter-subcategory-${sub.id}`}>
                                {sub.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
            <h4 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">Faixa de Preço</h4>
            <Slider 
              defaultValue={[0, 1000]} 
              max={1000} 
              step={10} 
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-8"
            />
            <div className="flex justify-between items-center">
              <div className="px-3 py-1.5 bg-muted rounded-lg text-xs font-bold text-primary">R$ {priceRange[0]}</div>
              <div className="w-4 h-px bg-primary/10"></div>
              <div className="px-3 py-1.5 bg-muted rounded-lg text-xs font-bold text-primary">R$ {priceRange[1]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (categoriesLoading || productsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-[#01034a] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Mascot Image */}
        <div className="absolute right-6 bottom-0 top-0 w-28 md:w-32 lg:w-36 opacity-95 pointer-events-none z-0">
          <img 
            src="/mascot.png" 
            alt="Construmax Mascot" 
            className="h-full w-full object-contain object-bottom drop-shadow-xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#fdd700]">Catálogo de Produtos</h1>
          <p className="text-white/70 text-lg max-w-2xl md:pr-48">Encontre as melhores marcas e os menores preços para o seu depósito ou obra.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filter Sheet */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filtrar Produtos
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative w-full max-w-xl">
                <Input 
                  placeholder="O que você está procurando hoje?" 
                  className="w-full h-14 pl-14 pr-6 rounded-2xl border-primary/10 bg-white shadow-sm focus-visible:ring-secondary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
              </div>
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-primary/5 shadow-sm">
                <span className="text-sm font-bold text-primary">
                  {filteredProducts.length} <span className="font-medium text-muted-foreground">Produtos encontrados</span>
                </span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <h3 className="text-lg font-medium text-muted-foreground">Nenhum produto encontrado</h3>
                <p className="text-sm text-muted-foreground mt-2">Tente ajustar seus filtros ou busca.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSubcategories([]);
                    setPriceRange([0, 1000]);
                    setSearchQuery("");
                  }}
                  data-testid="button-clear-filters"
                >
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
