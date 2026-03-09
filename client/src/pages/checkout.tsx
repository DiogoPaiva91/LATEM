import { Layout } from "@/components/layout";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Truck, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "success">("cart");
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState("boleto");

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      setStep("success");
      clearCart();
      window.scrollTo(0, 0);
    },
    onError: () => {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartTotal < 600) {
      toast({
        title: "Pedido Mínimo não atingido",
        description: "O valor mínimo para compra é de R$ 600,00",
        variant: "destructive"
      });
      return;
    }

    createOrderMutation.mutate({
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      total: Math.round(cartTotal * 100),
      paymentMethod,
      status: "Pendente",
    });
  };

  if (step === "success") {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary mb-4">Pedido Realizado com Sucesso!</h1>
          <p className="text-xl text-muted-foreground max-w-lg mb-8">
            Obrigado por comprar na Lá tem Costa Marta. Você receberá um e-mail com os detalhes do seu pedido e o código de rastreio em breve.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/">Voltar para Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/catalog">Fazer Novo Pedido</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Seu carrinho está vazio</h1>
          <Button asChild className="rounded-full">
            <Link href="/catalog">Começar a Comprar</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/catalog" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Continuar Comprando
          </Link>
          <h1 className="text-3xl font-display font-bold text-primary mt-2">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleFinish} className="space-y-10">
              
              {/* Address Section */}
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary text-white p-8">
                  <CardTitle className="text-2xl font-display flex items-center gap-3">
                    <Truck className="h-6 w-6 text-secondary" /> Dados de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-sm font-bold text-primary">CEP</Label>
                    <Input id="cep" placeholder="00000-000" className="h-12 rounded-xl border-primary/10 bg-muted/30 focus:bg-white transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-sm font-bold text-primary">Rua / Avenida</Label>
                    <Input id="street" placeholder="Nome do Logradouro" className="h-12 rounded-xl border-primary/10 bg-muted/30 focus:bg-white transition-all" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number" className="text-sm font-bold text-primary">Número</Label>
                      <Input id="number" placeholder="123" className="h-12 rounded-xl border-primary/10 bg-muted/30 focus:bg-white transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comp" className="text-sm font-bold text-primary">Comp.</Label>
                      <Input id="comp" placeholder="Apto..." className="h-12 rounded-xl border-primary/10 bg-muted/30 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-bold text-primary">Bairro</Label>
                    <Input id="district" placeholder="Seu Bairro" className="h-12 rounded-xl border-primary/10 bg-muted/30 focus:bg-white transition-all" required />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary text-white p-8">
                  <CardTitle className="text-2xl font-display">Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <RadioGroupItem value="boleto" id="boleto" className="peer sr-only" />
                      <Label htmlFor="boleto" className="flex flex-col items-center gap-3 p-6 border-2 border-primary/5 rounded-2xl cursor-pointer hover:border-secondary peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/5 transition-all">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <span className="font-bold text-sm text-center">Boleto (5% OFF)</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                      <Label htmlFor="pix" className="flex flex-col items-center gap-3 p-6 border-2 border-primary/5 rounded-2xl cursor-pointer hover:border-secondary peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/5 transition-all">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                        <span className="font-bold text-sm text-center">PIX (Imediato)</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label htmlFor="card" className="flex flex-col items-center gap-3 p-6 border-2 border-primary/5 rounded-2xl cursor-pointer hover:border-secondary peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/5 transition-all">
                        <Smartphone className="h-8 w-8 text-primary" />
                        <span className="font-bold text-sm text-center">Cartão de Crédito</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" disabled={createOrderMutation.isPending} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg h-14 rounded-full">
                {createOrderMutation.isPending ? "Processando..." : `Confirmar Pedido - R$ ${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-primary">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[180px]">{item.quantity}x {item.name}</span>
                      <span className="font-medium">R$ {((item.price / 100) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-2">
                    <span>Total</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {cartTotal < 600 && (
                   <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 text-center">
                     Adicione mais R$ {(600 - cartTotal).toFixed(2)} para atingir o pedido mínimo.
                   </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
