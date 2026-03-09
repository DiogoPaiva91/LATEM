import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import AdminDashboard from "@/pages/admin";
import FAQ from "@/pages/faq";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Contact from "@/pages/contact";
import BecomeClient from "@/pages/become-client";
import ClientArea from "@/pages/client-area";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/faq" component={FAQ} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/contact" component={Contact} />
      <Route path="/become-client" component={BecomeClient} />
      <Route path="/client-area" component={ClientArea} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
