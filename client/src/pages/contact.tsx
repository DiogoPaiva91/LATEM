import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, User } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-[#01034a] py-20 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-secondary text-secondary-foreground mb-6 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
              Sobre Nós
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Excelência em <span className="text-secondary">Distribuição</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Conectamos as melhores marcas do mercado ao seu negócio com logística eficiente, preços competitivos e atendimento especializado para revendas e construtoras.
            </p>
          </div>
        </div>

        {/* Mascot Decoration */}
        <img 
          src="/mascot.png" 
          alt="TheTeo" 
          className="absolute -bottom-12 -right-12 w-64 opacity-20 rotate-12 blur-[2px] md:w-96 md:opacity-40 md:blur-0 pointer-events-none"
        />
      </section>

      {/* About Us Mini Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80" 
                  alt="Lá Tem Warehouse" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-50 z-0"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary rounded-full blur-3xl opacity-20 z-0"></div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                Sobre a Lá Tem
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight">
                Mais que um fornecedor, <br />
                <span className="text-secondary">seu parceiro de obra.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fundada com o objetivo de simplificar o abastecimento de lojas de materiais de construção e construtoras, 
                a <strong>Lá Tem Costa Marta</strong> se destaca pela agilidade logística e pelo atendimento consultivo.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Trabalhamos apenas com marcas certificadas e oferecemos condições comerciais exclusivas para CNPJ, 
                garantindo que seu negócio tenha sempre as melhores margens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-primary mb-2">Televendas</h3>
                  <p className="text-muted-foreground mb-4 text-sm">Fale diretamente com um consultor.</p>
                  <a href="tel:+5511999999999" className="text-lg font-bold text-primary hover:text-secondary transition-colors block">
                    (11) 4002-8922
                  </a>
                  <span className="text-xs text-muted-foreground block mt-1">Seg. a Sex. das 8h às 18h</span>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-primary mb-2">Email</h3>
                  <p className="text-muted-foreground mb-4 text-sm">Para orçamentos e dúvidas gerais.</p>
                  <a href="mailto:contato@latematacadista.com.br" className="text-lg font-bold text-primary hover:text-secondary transition-colors block">
                    contato@latematacadista.com.br
                  </a>
                  <span className="text-xs text-muted-foreground block mt-1">Resposta em até 24h úteis</span>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-primary mb-2">Endereço</h3>
                  <p className="text-muted-foreground mb-4 text-sm">Visite nosso centro de distribuição.</p>
                  <address className="text-base font-medium text-primary not-italic">
                    Av. José Maria Whitaker, 2106 - Planalto Paulista<br />
                    São Paulo - SP, 04057-000
                  </address>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="h-full border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                <CardContent className="p-8 md:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-display font-bold text-primary mb-2">Envie uma mensagem</h2>
                    <p className="text-muted-foreground">Preencha o formulário abaixo e entraremos em contato o mais breve possível.</p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Nome Completo / Razão Social</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Digite seu nome ou da empresa" className="pl-10 h-12 bg-muted/30 border-muted-foreground/20 focus:border-secondary transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Email Corporativo</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input type="email" placeholder="seu@email.com" className="pl-10 h-12 bg-muted/30 border-muted-foreground/20 focus:border-secondary transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Telefone / WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="(00) 00000-0000" className="pl-10 h-12 bg-muted/30 border-muted-foreground/20 focus:border-secondary transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Assunto</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Ex: Orçamento, Dúvida, Parceria" className="pl-10 h-12 bg-muted/30 border-muted-foreground/20 focus:border-secondary transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Mensagem</label>
                      <Textarea placeholder="Como podemos ajudar?" className="min-h-[150px] bg-muted/30 border-muted-foreground/20 focus:border-secondary transition-colors resize-none" />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground hidden md:block">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Atendimento: Seg. a Sex. das 8h às 18h
                      </p>
                      <Button size="lg" className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 h-14 px-8 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                        Enviar Mensagem
                        <Send className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
