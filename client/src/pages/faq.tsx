import { Layout } from "@/components/layout";
import { Plus, Minus, Search, MessageCircle, Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";

const faqData = [
  {
    category: "Pedidos e Entregas",
    items: [
      {
        question: "Qual o valor do pedido mínimo?",
        answer: "O valor do pedido mínimo é de R$ 600,00 (seiscentos reais). Este valor foi estabelecido para garantir as melhores condições de preço para nossos parceiros lojistas."
      },
      {
        question: "Qual o prazo de entrega?",
        answer: "No estado de São Paulo entregamos em até 24 horas úteis após a aprovação do pedido. Para outras regiões, o prazo pode variar - consulte nosso televendas para uma estimativa precisa."
      }
    ]
  },
  {
    category: "Cadastro e Conta",
    items: [
      {
        question: "Quanto tempo leva para o cadastro ser aprovado?",
        answer: "Os cadastros são analisados em até 24 horas úteis após o envio de toda a documentação solicitada (ficha cadastral + contrato social + pedido + referências comerciais)."
      },
      {
        question: "Pessoas físicas podem comprar?",
        answer: "Não. A Lá tem Costa Marta é um atacadista exclusivo para lojistas (comércio) com CNPJ ativo ou produtores rurais com CPF e Inscrição Estadual válida."
      },
      {
        question: "Como obter login e senha?",
        answer: "Se você já é nosso cliente cadastrado, solicite seu acesso entrando em contato com nosso departamento financeiro através do e-mail financeiro@latematacadista.com.br."
      }
    ]
  },
  {
    category: "Atendimento",
    items: [
      {
        question: "Qual o horário de atendimento?",
        answer: "Nossa equipe está disponível de segunda à sexta-feira, das 8:00 às 18:00hs. Não realizamos atendimento aos sábados, domingos e feriados."
      },
      {
        question: "Possuem loja física?",
        answer: "Não possuímos loja física aberta ao público. Atuamos através de televendas, representantes comerciais e nosso e-commerce B2B."
      }
    ]
  },
  {
    category: "Trabalhe Conosco",
    items: [
      {
        question: "Como ser um representante comercial?",
        answer: "É necessário ter empresa de representação comercial (CORE), experiência em vendas no setor, veículo próprio, conhecimento básico de informática e residir na região de atuação."
      },
      {
        question: "Como enviar currículo?",
        answer: "Envie seu currículo para rh@latematacadista.com.br. Ele ficará em nosso banco de talentos para futuras oportunidades."
      }
    ]
  }
];

export default function FAQ() {
  const [openSection, setOpenSection] = useState<string | null>("Pedidos e Entregas-0");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const toggleAccordion = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const filteredData = faqData.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-50 gap-2 text-white/50 hover:text-white hover:bg-white/10"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-secondary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-1/3 h-full bg-secondary/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
          <Badge className="bg-secondary text-secondary-foreground mb-6 px-4 py-1.5 text-sm font-bold rounded-full animate-fade-in">
            Central de Ajuda
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight text-[#ffffff]">
            Como podemos <span className="text-secondary">ajudar?</span>
          </h1>
          
          <p className="text-white/80 text-xl mb-12 leading-relaxed max-w-2xl">
            Encontre respostas rápidas para suas dúvidas sobre pedidos, entregas e cadastro.
          </p>
          
          <div className="relative w-full max-w-2xl mx-auto z-20">
            <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-2xl transform scale-95 translate-y-2"></div>
            <Input 
              placeholder="Digite sua dúvida aqui... (Ex: Entrega, Boleto, Cadastro)" 
              className="relative h-16 pl-14 pr-6 rounded-2xl bg-white text-primary placeholder:text-muted-foreground shadow-2xl border-0 text-lg w-full focus-visible:ring-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
            
            <div className="absolute -top-16 -right-4 w-24 h-24 md:w-32 md:h-32 pointer-events-none transform rotate-12 z-0 hidden sm:block">
               <img 
                src="/mascot.png" 
                alt="TheTeo ajudando" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/30 min-h-screen py-20">
        <div className="container mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* FAQ List */}
            <div className="lg:col-span-8 space-y-10">
              {filteredData.length > 0 ? (
                filteredData.map((section, sIndex) => (
                  <div key={sIndex} className="space-y-4">
                    <h3 className="text-xl font-display font-bold text-primary flex items-center gap-3">
                      <span className="w-8 h-1 bg-secondary rounded-full"></span>
                      {section.category}
                    </h3>
                    
                    <div className="space-y-4">
                      {section.items.map((item, index) => {
                        const id = `${section.category}-${index}`;
                        const isOpen = openSection === id;
                        
                        return (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-secondary shadow-md' : 'border-transparent shadow-sm hover:shadow-md'}`}
                          >
                            <button
                              onClick={() => toggleAccordion(id)}
                              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group focus:outline-none"
                            >
                              <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                                {item.question}
                              </span>
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/5'}`}>
                                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                              </div>
                            </button>
                            
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                  <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                                    <div className="w-full h-px bg-muted mb-4"></div>
                                    {item.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground">Tente buscar por outros termos ou navegue pelas categorias.</p>
                </div>
              )}
            </div>

            {/* Sidebar Contact */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                <Card className="border-none shadow-lg bg-primary text-white overflow-hidden relative">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageCircle className="h-8 w-8 text-secondary" />
                      <h3 className="text-2xl font-display font-bold text-[#ffffff]">Ainda tem dúvidas?</h3>
                    </div>
                    <p className="text-white/70 mb-8 leading-relaxed">
                      Nossa equipe de especialistas está pronta para ajudar você com qualquer questão.
                    </p>
                    
                    <div className="space-y-4">
                      <Button variant="secondary" className="w-full h-12 justify-between group font-bold">
                        Falar no WhatsApp
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                      <Button variant="outline" className="w-full h-12 justify-between group border-white/20 hover:bg-white/10 text-white hover:text-white">
                        (11) 9999-9999
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">E-mail</h4>
                        <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
                      </div>
                    </div>
                    <a href="mailto:contato@latematacadista.com.br" className="text-primary font-medium hover:text-secondary transition-colors break-all">contato@latematacadista.com.br</a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
