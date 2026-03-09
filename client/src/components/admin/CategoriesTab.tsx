import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Download, 
  MoreHorizontal, 
  LayoutGrid, 
  List, 
  ChevronRight, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit, 
  Copy, 
  Eye, 
  EyeOff, 
  X, 
  UploadCloud, 
  Search as SearchIcon,
  Tag,
  CloudUpload,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Mock data for categories
const initialCategories = [
  // 1. Cimentos e Argamassas
  { id: "1", name: "Cimentos e Argamassas", slug: "cimentos-e-argamassas", icon: "🧱", color: "#8B7355", subcategories: 4, products: 120, status: "Ativa", order: 1, parentId: null },
  { id: "1-1", name: "Cimentos", slug: "cimentos", icon: "🧱", color: "#8B7355", subcategories: 0, products: 30, status: "Ativa", order: 1, parentId: "1" },
  { id: "1-2", name: "Argamassas", slug: "argamassas", icon: "🧱", color: "#8B7355", subcategories: 0, products: 45, status: "Ativa", order: 2, parentId: "1" },
  { id: "1-3", name: "Rejuntes", slug: "rejuntes", icon: "🧱", color: "#8B7355", subcategories: 0, products: 25, status: "Ativa", order: 3, parentId: "1" },
  { id: "1-4", name: "Concreto Pronto", slug: "concreto-pronto", icon: "🧱", color: "#8B7355", subcategories: 0, products: 20, status: "Ativa", order: 4, parentId: "1" },

  // 2. Blocos e Tijolos
  { id: "2", name: "Blocos e Tijolos", slug: "blocos-e-tijolos", icon: "🏗️", color: "#A0522D", subcategories: 4, products: 85, status: "Ativa", order: 2, parentId: null },
  { id: "2-1", name: "Blocos de Concreto", slug: "blocos-de-concreto", icon: "🏗️", color: "#A0522D", subcategories: 0, products: 20, status: "Ativa", order: 1, parentId: "2" },
  { id: "2-2", name: "Tijolos Cerâmicos", slug: "tijolos-ceramicos", icon: "🏗️", color: "#A0522D", subcategories: 0, products: 35, status: "Ativa", order: 2, parentId: "2" },
  { id: "2-3", name: "Blocos de Vidro", slug: "blocos-de-vidro", icon: "🏗️", color: "#A0522D", subcategories: 0, products: 15, status: "Ativa", order: 3, parentId: "2" },
  { id: "2-4", name: "Lajes Pré-Moldadas", slug: "lajes-pre-moldadas", icon: "🏗️", color: "#A0522D", subcategories: 0, products: 15, status: "Ativa", order: 4, parentId: "2" },

  // 3. Areia, Pedra e Agregados
  { id: "3", name: "Areia, Pedra e Agregados", slug: "areia-pedra-e-agregados", icon: "🪨", color: "#B8A88A", subcategories: 4, products: 60, status: "Ativa", order: 3, parentId: null },
  { id: "3-1", name: "Areia", slug: "areia", icon: "🪨", color: "#B8A88A", subcategories: 0, products: 15, status: "Ativa", order: 1, parentId: "3" },
  { id: "3-2", name: "Pedra Brita", slug: "pedra-brita", icon: "🪨", color: "#B8A88A", subcategories: 0, products: 15, status: "Ativa", order: 2, parentId: "3" },
  { id: "3-3", name: "Pedrisco e Cascalho", slug: "pedrisco-e-cascalho", icon: "🪨", color: "#B8A88A", subcategories: 0, products: 15, status: "Ativa", order: 3, parentId: "3" },
  { id: "3-4", name: "Pedra Decorativa", slug: "pedra-decorativa", icon: "🪨", color: "#B8A88A", subcategories: 0, products: 15, status: "Ativa", order: 4, parentId: "3" },

  // 4. Aço e Ferragens
  { id: "4", name: "Aço e Ferragens", slug: "aco-e-ferragens", icon: "🔩", color: "#708090", subcategories: 5, products: 150, status: "Ativa", order: 4, parentId: null },
  { id: "4-1", name: "Vergalhões", slug: "vergalhoes", icon: "🔩", color: "#708090", subcategories: 0, products: 30, status: "Ativa", order: 1, parentId: "4" },
  { id: "4-2", name: "Telas e Arames", slug: "telas-e-arames", icon: "🔩", color: "#708090", subcategories: 0, products: 30, status: "Ativa", order: 2, parentId: "4" },
  { id: "4-3", name: "Pregos", slug: "pregos", icon: "🔩", color: "#708090", subcategories: 0, products: 30, status: "Ativa", order: 3, parentId: "4" },
  { id: "4-4", name: "Parafusos e Fixadores", slug: "parafusos-e-fixadores", icon: "🔩", color: "#708090", subcategories: 0, products: 40, status: "Ativa", order: 4, parentId: "4" },
  { id: "4-5", name: "Perfis Metálicos", slug: "perfis-metalicos", icon: "🔩", color: "#708090", subcategories: 0, products: 20, status: "Ativa", order: 5, parentId: "4" },

  // 5. Tintas e Pintura
  { id: "5", name: "Tintas e Pintura", slug: "tintas-e-pintura", icon: "🎨", color: "#FF6B35", subcategories: 5, products: 200, status: "Ativa", order: 5, parentId: null },
  { id: "5-1", name: "Tintas", slug: "tintas", icon: "🎨", color: "#FF6B35", subcategories: 0, products: 80, status: "Ativa", order: 1, parentId: "5" },
  { id: "5-2", name: "Massa e Selador", slug: "massa-e-selador", icon: "🎨", color: "#FF6B35", subcategories: 0, products: 30, status: "Ativa", order: 2, parentId: "5" },
  { id: "5-3", name: "Textura e Grafiato", slug: "textura-e-grafiato", icon: "🎨", color: "#FF6B35", subcategories: 0, products: 40, status: "Ativa", order: 3, parentId: "5" },
  { id: "5-4", name: "Verniz", slug: "verniz", icon: "🎨", color: "#FF6B35", subcategories: 0, products: 20, status: "Ativa", order: 4, parentId: "5" },
  { id: "5-5", name: "Acessórios de Pintura", slug: "acessorios-de-pintura", icon: "🎨", color: "#FF6B35", subcategories: 0, products: 30, status: "Ativa", order: 5, parentId: "5" },

  // 6. Hidráulica
  { id: "6", name: "Hidráulica", slug: "hidraulica", icon: "🚿", color: "#4A90D9", subcategories: 6, products: 250, status: "Ativa", order: 6, parentId: null },
  { id: "6-1", name: "Tubos e Conexões", slug: "tubos-e-conexoes", icon: "🚿", color: "#4A90D9", subcategories: 0, products: 100, status: "Ativa", order: 1, parentId: "6" },
  { id: "6-2", name: "Registros e Válvulas", slug: "registros-e-valvulas", icon: "🚿", color: "#4A90D9", subcategories: 0, products: 40, status: "Ativa", order: 2, parentId: "6" },
  { id: "6-3", name: "Caixas D'água", slug: "caixas-dagua", icon: "🚿", color: "#4A90D9", subcategories: 0, products: 20, status: "Ativa", order: 3, parentId: "6" },
  { id: "6-4", name: "Torneiras e Misturadores", slug: "torneiras-e-misturadores", icon: "🚿", color: "#4A90D9", subcategories: 0, products: 50, status: "Ativa", order: 4, parentId: "6" },
  { id: "6-5", name: "Vasos e Pias", slug: "vasos-e-pias", icon: "🚿", color: "#4A90D9", subcategories: 0, products: 25, status: "Ativa", order: 5, parentId: "6" },
  { id: "6-6", name: "Ralos e Sifões", slug: "ralos-e-sifoes", icon: "🚿", color: "#4A90D9", subcategories: 0, products: 15, status: "Ativa", order: 6, parentId: "6" },

  // 7. Elétrica
  { id: "7", name: "Elétrica", slug: "eletrica", icon: "⚡", color: "#F5A623", subcategories: 5, products: 300, status: "Ativa", order: 7, parentId: null },
  { id: "7-1", name: "Fios e Cabos", slug: "fios-e-cabos", icon: "⚡", color: "#F5A623", subcategories: 0, products: 80, status: "Ativa", order: 1, parentId: "7" },
  { id: "7-2", name: "Disjuntores e Quadros", slug: "disjuntores-e-quadros", icon: "⚡", color: "#F5A623", subcategories: 0, products: 40, status: "Ativa", order: 2, parentId: "7" },
  { id: "7-3", name: "Tomadas e Interruptores", slug: "tomadas-e-interruptores", icon: "⚡", color: "#F5A623", subcategories: 0, products: 100, status: "Ativa", order: 3, parentId: "7" },
  { id: "7-4", name: "Eletrodutos e Conduítes", slug: "eletrodutos-e-conduites", icon: "⚡", color: "#F5A623", subcategories: 0, products: 30, status: "Ativa", order: 4, parentId: "7" },
  { id: "7-5", name: "Lâmpadas e Luminárias", slug: "lampadas-e-luminarias", icon: "⚡", color: "#F5A623", subcategories: 0, products: 50, status: "Ativa", order: 5, parentId: "7" },

  // 8. Portas, Janelas e Esquadrias
  { id: "8", name: "Portas, Janelas e Esquadrias", slug: "portas-janelas-e-esquadrias", icon: "🪟", color: "#6B8E23", subcategories: 4, products: 120, status: "Ativa", order: 8, parentId: null },
  { id: "8-1", name: "Portas", slug: "portas", icon: "🪟", color: "#6B8E23", subcategories: 0, products: 50, status: "Ativa", order: 1, parentId: "8" },
  { id: "8-2", name: "Janelas", slug: "janelas", icon: "🪟", color: "#6B8E23", subcategories: 0, products: 40, status: "Ativa", order: 2, parentId: "8" },
  { id: "8-3", name: "Fechaduras e Dobradiças", slug: "fechaduras-e-dobradicas", icon: "🪟", color: "#6B8E23", subcategories: 0, products: 20, status: "Ativa", order: 3, parentId: "8" },
  { id: "8-4", name: "Vidros", slug: "vidros", icon: "🪟", color: "#6B8E23", subcategories: 0, products: 10, status: "Ativa", order: 4, parentId: "8" },

  // 9. Pisos e Revestimentos
  { id: "9", name: "Pisos e Revestimentos", slug: "pisos-e-revestimentos", icon: "🏠", color: "#CD853F", subcategories: 5, products: 220, status: "Ativa", order: 9, parentId: null },
  { id: "9-1", name: "Porcelanato", slug: "porcelanato", icon: "🏠", color: "#CD853F", subcategories: 0, products: 80, status: "Ativa", order: 1, parentId: "9" },
  { id: "9-2", name: "Cerâmica e Azulejo", slug: "ceramica-e-azulejo", icon: "🏠", color: "#CD853F", subcategories: 0, products: 60, status: "Ativa", order: 2, parentId: "9" },
  { id: "9-3", name: "Piso Laminado e Vinílico", slug: "piso-laminado-e-vinilico", icon: "🏠", color: "#CD853F", subcategories: 0, products: 40, status: "Ativa", order: 3, parentId: "9" },
  { id: "9-4", name: "Pedras Naturais", slug: "pedras-naturais", icon: "🏠", color: "#CD853F", subcategories: 0, products: 20, status: "Ativa", order: 4, parentId: "9" },
  { id: "9-5", name: "Rodapés e Soleiras", slug: "rodapes-e-soleiras", icon: "🏠", color: "#CD853F", subcategories: 0, products: 20, status: "Ativa", order: 5, parentId: "9" },

  // 10. Madeiras
  { id: "10", name: "Madeiras", slug: "madeiras", icon: "🪵", color: "#DEB887", subcategories: 4, products: 90, status: "Ativa", order: 10, parentId: null },
  { id: "10-1", name: "Tábuas e Vigas", slug: "tabuas-e-vigas", icon: "🪵", color: "#DEB887", subcategories: 0, products: 40, status: "Ativa", order: 1, parentId: "10" },
  { id: "10-2", name: "Compensado e MDF", slug: "compensado-e-mdf", icon: "🪵", color: "#DEB887", subcategories: 0, products: 30, status: "Ativa", order: 2, parentId: "10" },
  { id: "10-3", name: "Forro", slug: "forro", icon: "🪵", color: "#DEB887", subcategories: 0, products: 10, status: "Ativa", order: 3, parentId: "10" },
  { id: "10-4", name: "Deck", slug: "deck", icon: "🪵", color: "#DEB887", subcategories: 0, products: 10, status: "Ativa", order: 4, parentId: "10" },

  // 11. Impermeabilização
  { id: "11", name: "Impermeabilização", slug: "impermeabilizacao", icon: "🛡️", color: "#4682B4", subcategories: 4, products: 65, status: "Ativa", order: 11, parentId: null },
  { id: "11-1", name: "Mantas Asfálticas", slug: "mantas-asfalticas", icon: "🛡️", color: "#4682B4", subcategories: 0, products: 15, status: "Ativa", order: 1, parentId: "11" },
  { id: "11-2", name: "Impermeabilizantes Líquidos", slug: "impermeabilizantes-liquidos", icon: "🛡️", color: "#4682B4", subcategories: 0, products: 25, status: "Ativa", order: 2, parentId: "11" },
  { id: "11-3", name: "Silicones e Selantes", slug: "silicones-e-selantes", icon: "🛡️", color: "#4682B4", subcategories: 0, products: 15, status: "Ativa", order: 3, parentId: "11" },
  { id: "11-4", name: "Lonas", slug: "lonas", icon: "🛡️", color: "#4682B4", subcategories: 0, products: 10, status: "Ativa", order: 4, parentId: "11" },

  // 12. Segurança e EPI
  { id: "12", name: "Segurança e EPI", slug: "seguranca-e-epi", icon: "🦺", color: "#FF4444", subcategories: 5, products: 110, status: "Ativa", order: 12, parentId: null },
  { id: "12-1", name: "Capacetes", slug: "capacetes", icon: "🦺", color: "#FF4444", subcategories: 0, products: 20, status: "Ativa", order: 1, parentId: "12" },
  { id: "12-2", name: "Luvas", slug: "luvas", icon: "🦺", color: "#FF4444", subcategories: 0, products: 40, status: "Ativa", order: 2, parentId: "12" },
  { id: "12-3", name: "Óculos e Máscaras", slug: "oculos-e-mascaras", icon: "🦺", color: "#FF4444", subcategories: 0, products: 20, status: "Ativa", order: 3, parentId: "12" },
  { id: "12-4", name: "Calçados", slug: "calcados", icon: "🦺", color: "#FF4444", subcategories: 0, products: 15, status: "Ativa", order: 4, parentId: "12" },
  { id: "12-5", name: "Sinalização", slug: "sinalizacao", icon: "🦺", color: "#FF4444", subcategories: 0, products: 15, status: "Ativa", order: 5, parentId: "12" },

  // 13. Ferramentas
  { id: "13", name: "Ferramentas", slug: "ferramentas", icon: "🔧", color: "#555555", subcategories: 5, products: 350, status: "Ativa", order: 13, parentId: null },
  { id: "13-1", name: "Ferramentas Manuais", slug: "ferramentas-manuais", icon: "🔧", color: "#555555", subcategories: 0, products: 150, status: "Ativa", order: 1, parentId: "13" },
  { id: "13-2", name: "Ferramentas Elétricas", slug: "ferramentas-eletricas", icon: "🔧", color: "#555555", subcategories: 0, products: 100, status: "Ativa", order: 2, parentId: "13" },
  { id: "13-3", name: "Ferramentas de Pedreiro", slug: "ferramentas-de-pedreiro", icon: "🔧", color: "#555555", subcategories: 0, products: 50, status: "Ativa", order: 3, parentId: "13" },
  { id: "13-4", name: "Escadas", slug: "escadas", icon: "🔧", color: "#555555", subcategories: 0, products: 30, status: "Ativa", order: 4, parentId: "13" },
  { id: "13-5", name: "Carrinhos e Transporte", slug: "carrinhos-e-transporte", icon: "🔧", color: "#555555", subcategories: 0, products: 20, status: "Ativa", order: 5, parentId: "13" },

  // 14. Cobertura e Telhas
  { id: "14", name: "Cobertura e Telhas", slug: "cobertura-e-telhas", icon: "🏡", color: "#CC7722", subcategories: 5, products: 85, status: "Ativa", order: 14, parentId: null },
  { id: "14-1", name: "Telhas Cerâmicas", slug: "telhas-ceramicas", icon: "🏡", color: "#CC7722", subcategories: 0, products: 20, status: "Ativa", order: 1, parentId: "14" },
  { id: "14-2", name: "Telhas de Fibrocimento", slug: "telhas-de-fibrocimento", icon: "🏡", color: "#CC7722", subcategories: 0, products: 15, status: "Ativa", order: 2, parentId: "14" },
  { id: "14-3", name: "Telhas Metálicas", slug: "telhas-metalicas", icon: "🏡", color: "#CC7722", subcategories: 0, products: 20, status: "Ativa", order: 3, parentId: "14" },
  { id: "14-4", name: "Telhas de Policarbonato", slug: "telhas-de-policarbonato", icon: "🏡", color: "#CC7722", subcategories: 0, products: 10, status: "Ativa", order: 4, parentId: "14" },
  { id: "14-5", name: "Calhas e Rufos", slug: "calhas-e-rufos", icon: "🏡", color: "#CC7722", subcategories: 0, products: 20, status: "Ativa", order: 5, parentId: "14" },

  // 15. Jardim e Área Externa
  { id: "15", name: "Jardim e Área Externa", slug: "jardim-e-area-externa", icon: "🌿", color: "#2E8B57", subcategories: 5, products: 130, status: "Ativa", order: 15, parentId: null },
  { id: "15-1", name: "Grama e Adubo", slug: "grama-e-adubo", icon: "🌿", color: "#2E8B57", subcategories: 0, products: 30, status: "Ativa", order: 1, parentId: "15" },
  { id: "15-2", name: "Mangueiras e Irrigação", slug: "mangueiras-e-irrigacao", icon: "🌿", color: "#2E8B57", subcategories: 0, products: 40, status: "Ativa", order: 2, parentId: "15" },
  { id: "15-3", name: "Pisos Externos", slug: "pisos-externos", icon: "🌿", color: "#2E8B57", subcategories: 0, products: 25, status: "Ativa", order: 3, parentId: "15" },
  { id: "15-4", name: "Cercas e Telas", slug: "cercas-e-telas", icon: "🌿", color: "#2E8B57", subcategories: 0, products: 15, status: "Ativa", order: 4, parentId: "15" },
  { id: "15-5", name: "Iluminação Externa", slug: "iluminacao-externa", icon: "🌿", color: "#2E8B57", subcategories: 0, products: 20, status: "Ativa", order: 5, parentId: "15" },

  // 16. Utilidades e Consumíveis
  { id: "16", name: "Utilidades e Consumíveis", slug: "utilidades-e-consumiveis", icon: "📦", color: "#9370DB", subcategories: 4, products: 140, status: "Ativa", order: 16, parentId: null },
  { id: "16-1", name: "Colas e Adesivos", slug: "colas-e-adesivos", icon: "📦", color: "#9370DB", subcategories: 0, products: 40, status: "Ativa", order: 1, parentId: "16" },
  { id: "16-2", name: "Fitas", slug: "fitas", icon: "📦", color: "#9370DB", subcategories: 0, products: 30, status: "Ativa", order: 2, parentId: "16" },
  { id: "16-3", name: "Lixas", slug: "lixas", icon: "📦", color: "#9370DB", subcategories: 0, products: 50, status: "Ativa", order: 3, parentId: "16" },
  { id: "16-4", name: "Cordas e Arames", slug: "cordas-e-arames", icon: "📦", color: "#9370DB", subcategories: 0, products: 20, status: "Ativa", order: 4, parentId: "16" },
];

const iconsList = [
  { category: "Construção Civil", icons: ["🧱", "🏗️", "🔨", "🪓", "🪚", "🔩", "🪛", "🪵", "🧲", "🪜", "🛠️", "🔧", "🪤", "⛏️", "🏠", "🏢"] },
  { category: "Elétrica e Iluminação", icons: ["💡", "⚡", "🔌", "🔋", "💠", "🕯️", "🔦", "✨"] },
  { category: "Hidráulica e Água", icons: ["🚿", "🚰", "💧", "🪠", "🛁", "🏊", "💦", "🌊"] },
  { category: "Pintura e Acabamento", icons: ["🎨", "🖌️", "🪣", "🖼️", "🌈", "🎭", "✏️", "🖍️"] },
  { category: "Jardim e Externo", icons: ["🌿", "🌱", "🪴", "🌳", "🏡", "🪨", "🌻", "🍃"] },
  { category: "Segurança e EPI", icons: ["🦺", "🥽", "🧤", "⛑️", "🔒", "🛡️", "🚧", "🔐"] },
  { category: "Ferramentas Manuais", icons: ["🔨", "🪛", "🔧", "🗜️", "📐", "📏", "🪚", "✂️"] },
  { category: "Transporte e Logística", icons: ["🚚", "📦", "🏷️", "🛒", "📋", "🗃️", "🧾", "📊"] },
  { category: "Geral", icons: ["⭐", "🏆", "💎", "🎯", "🔥", "❄️", "♻️", "🌍"] }
];


export function CategoriesTab() {
  const { data: categories = [] } = useQuery<any[]>({ queryKey: ["/api/categories"] });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todas");
  const [filterLevel, setFilterLevel] = useState("Todas");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "Categoria",
    name: "",
    slug: "",
    icon: "📦",
    imageUrl: "",
    color: "#8B7355",
    description: "",
    parentId: "",
    order: 0,
    isActive: true,
  });

  const [iconSearch, setIconSearch] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const openForm = (category?: any) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        type: category.parentId ? "Subcategoria" : "Categoria",
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        imageUrl: category.image || category.imageUrl || "",
        color: category.color || "#8B7355",
        description: category.description || "",
        parentId: category.parentId || "",
        order: category.order,
        isActive: category.status === "Ativa",
      });
    } else {
      setEditingId(null);
      setFormData({
        type: "Categoria",
        name: "",
        slug: "",
        icon: "📦",
        imageUrl: "",
        color: "#8B7355",
        description: "",
        parentId: "",
        order: 0,
        isActive: true,
      });
    }
    setIsFormOpen(true);
  };

  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsFormOpen(false);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsFormOpen(false);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/categories"] }),
  });

  const { toast } = useToast();
  const [pushingCategoryId, setPushingCategoryId] = useState<number | null>(null);

  const pushToBlingMutation = useMutation({
    mutationFn: async (id: number) => {
      setPushingCategoryId(id);
      const res = await apiRequest("POST", `/api/bling/push-category/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categoria enviada ao Bling", description: "Status atualizado para Sincronizado." });
      setPushingCategoryId(null);
    },
    onError: (err: any) => {
      toast({ title: "Erro ao enviar ao Bling", description: err.message || "Tente novamente.", variant: "destructive" });
      setPushingCategoryId(null);
    },
  });

  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncDirection, setSyncDirection] = useState<'idle' | 'pushing' | 'pulling'>('idle');
  const [syncResult, setSyncResult] = useState<{ pushed?: number; errors?: number; synced?: number; details?: string[] } | null>(null);

  const unsyncedParents = categories.filter((c: any) => !c.blingId && c.parentId === null);
  const unsyncedSubs = categories.filter((c: any) => !c.blingId && c.parentId !== null);
  const unsyncedTotal = unsyncedParents.length + unsyncedSubs.length;

  const pushAllMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/bling/push/categories"),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setSyncResult({ pushed: data.pushed, errors: data.errors, details: data.details });
      setSyncDirection('idle');
      toast({
        title: `${data.pushed} categorias enviadas ao Bling`,
        description: data.errors > 0 ? `${data.errors} erros encontrados.` : "Todas sincronizadas com sucesso!",
        variant: data.errors > 0 ? "destructive" : "default",
      });
    },
    onError: (err: any) => {
      setSyncDirection('idle');
      toast({ title: "Erro ao enviar categorias", description: err.message, variant: "destructive" });
    },
  });

  const pullMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/bling/sync/categories"),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setSyncResult({ synced: data.synced });
      setSyncDirection('idle');
      toast({
        title: `${data.synced} categorias importadas do Bling`,
        description: "Categorias atualizadas com sucesso.",
      });
    },
    onError: (err: any) => {
      setSyncDirection('idle');
      toast({ title: "Erro ao importar do Bling", description: err.message, variant: "destructive" });
    },
  });

  const handlePushAll = () => {
    setSyncDirection('pushing');
    setSyncResult(null);
    pushAllMutation.mutate();
  };

  const handlePull = () => {
    setSyncDirection('pulling');
    setSyncResult(null);
    pullMutation.mutate();
  };

  const saveCategory = () => {
    if (!formData.name) return;
    if (formData.type === "Subcategoria" && !formData.parentId) return;
    
    const categoryData = {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon,
      image: formData.imageUrl,
      color: formData.type === "Categoria" ? formData.color : "#8B7355",
      description: formData.description,
      parentId: formData.type === "Categoria" ? null : parseInt(formData.parentId),
      sortOrder: formData.order,
      status: formData.isActive ? "Ativa" : "Inativa",
    };

    if (editingId) {
      updateCategoryMutation.mutate({ id: parseInt(editingId), data: categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const deleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(parseInt(id));
  };

  // To display parent category names in subcategory cards, we need the full list of root categories
  const rootCategories = categories.filter(c => c.parentId === null);

  // Filter logic
  let filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== "Todas") {
    filtered = filtered.filter(c => c.status === filterStatus);
  }

  if (filterLevel === "Categorias") {
    filtered = filtered.filter(c => c.parentId === null);
  } else if (filterLevel === "Subcategorias") {
    filtered = filtered.filter(c => c.parentId !== null);
  }

  // Hierarchy building for table
  const rootCategoriesFiltered = filtered.filter(c => c.parentId === null).sort((a, b) => a.order - b.order);
  
  const getSubcategories = (parentId: string) => {
    return filtered.filter(c => c.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  if (isFormOpen) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-[#01034a]">{editingId ? (formData.type === "Categoria" ? "Editar Categoria" : "Editar Subcategoria") : "Nova Categoria"}</h1>
            <p className="text-muted-foreground mt-1">Cadastre as categorias e subcategorias dos seus produtos</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl h-12 px-6 border-muted hover:bg-muted/20">
               Voltar para Lista
            </Button>
          </div>
        </header>

        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white max-w-4xl mx-auto relative">
          <div className="bg-[#01034a] p-8 text-white relative overflow-hidden">
            {/* Mascot Image */}
            <div className="absolute right-6 bottom-0 top-0 w-32 opacity-90 pointer-events-none">
              <img 
                src="/mascot.png" 
                alt="Construmax Mascot" 
                className="h-full w-full object-contain object-bottom"
              />
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold text-[#fdd700]">{editingId ? (formData.type === "Categoria" ? "Editar Categoria" : "Editar Subcategoria") : "Nova Categoria"}</h2>
              <p className="text-white/70 mt-1">Cadastre as categorias e subcategorias dos seus produtos</p>
            </div>
          </div>
          
          <div className="p-8 space-y-8 bg-[fafafa]">
            {/* Type Selection */}
            {!editingId && (
              <div className="space-y-3">
                <Label className="font-bold text-[#01034a] text-lg">O que você está criando?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData(prev => ({...prev, type: "Categoria"}))}
                    className={`cursor-pointer border-2 rounded-2xl p-6 transition-all ${formData.type === "Categoria" ? 'border-[#01034a] bg-[#01034a]/5 shadow-sm' : 'border-muted bg-white hover:border-muted-foreground/30'}`}
                  >
                    <div className="text-4xl mb-3">📁</div>
                    <h3 className="font-bold text-[#01034a] text-lg mb-1">Categoria</h3>
                    <p className="text-sm text-muted-foreground">Grupo principal de produtos (ex: Tintas e Pintura)</p>
                  </div>
                  <div 
                    onClick={() => setFormData(prev => ({...prev, type: "Subcategoria"}))}
                    className={`cursor-pointer border-2 rounded-2xl p-6 transition-all ${formData.type === "Subcategoria" ? 'border-[#01034a] bg-[#01034a]/5 shadow-sm' : 'border-muted bg-white hover:border-muted-foreground/30'}`}
                  >
                    <div className="text-4xl mb-3">📂</div>
                    <h3 className="font-bold text-[#01034a] text-lg mb-1">Subcategoria</h3>
                    <p className="text-sm text-muted-foreground">Divisão dentro de uma categoria (ex: Tintas → Tinta Acrílica)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview Header */}
            <div className="bg-white p-4 rounded-2xl border border-muted shadow-sm flex items-center gap-4">
               <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center mb-0">Preview:</div>
               <div className={`relative flex items-center gap-3 px-4 py-2 rounded-xl border border-muted/50 w-full max-w-md overflow-hidden ${!formData.imageUrl ? 'bg-muted/20' : ''}`}>
                 {formData.imageUrl && formData.type === "Categoria" && (
                    <div className="absolute inset-0 z-0">
                      <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                 )}
                 <div className="relative z-10 flex items-center gap-3 w-full">
                 {formData.type === "Categoria" ? (
                    <>
                      {!formData.imageUrl && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border border-black/5 shrink-0 bg-white">
                          {formData.icon}
                        </div>
                      )}
                      <div>
                        <div className={`font-bold text-sm leading-tight ${formData.imageUrl ? 'text-white' : 'text-[#01034a]'}`}>{formData.name || "Nome da Categoria"}</div>
                        <div className={`text-[10px] font-mono leading-tight ${formData.imageUrl ? 'text-white/70' : 'text-muted-foreground'}`}>{formData.slug || "slug-gerado"}</div>
                      </div>
                    </>
                 ) : (
                    <>
                      <div className="flex items-center text-muted-foreground text-sm font-medium">
                        {formData.parentId && rootCategories.find(c => c.id === formData.parentId) ? (
                          <>
                            <span className="opacity-70 mr-1.5">{rootCategories.find(c => c.id === formData.parentId)?.icon}</span>
                            {rootCategories.find(c => c.id === formData.parentId)?.name}
                          </>
                        ) : "Categoria Pai"}
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                        <span className="font-bold text-[#01034a]">{formData.name || "Nome da Subcategoria"}</span>
                      </div>
                    </>
                 )}
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {formData.type === "Subcategoria" && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-[#01034a]">Pertence à Categoria <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Select value={formData.parentId} onValueChange={(val) => setFormData(prev => ({...prev, parentId: val}))}>
                      <SelectTrigger className="h-12 bg-white border-muted rounded-xl relative z-10">
                        <SelectValue placeholder="Selecione a categoria principal" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-muted shadow-lg bg-white relative z-50">
                        {rootCategories.filter(c => c.id !== editingId).map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <span className="opacity-50 text-base">{cat.icon}</span> {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {rootCategories.length === 0 && (
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-sm mt-2 flex items-start gap-2">
                      <span className="mt-0.5">⚠️</span> 
                      <span>Cadastre uma categoria primeiro antes de criar subcategorias.</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold text-[#01034a]">
                  {formData.type === "Categoria" ? "Nome da Categoria" : "Nome da Subcategoria"} <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="name" 
                  placeholder={formData.type === "Categoria" ? "Ex: Ferramentas Manuais" : "Ex: Tinta Acrílica"} 
                  className="bg-white h-12 border-muted focus:border-[#01034a] focus:ring-1 focus:ring-[#01034a] rounded-xl transition-all"
                  value={formData.name}
                  onChange={handleNameChange}
                  maxLength={80}
                />
                <div className="text-right text-xs text-muted-foreground">{formData.name.length}/80</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="font-bold text-[#01034a]">Slug (URL)</Label>
                <Input 
                  id="slug" 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
                  className="bg-muted/30 h-12 border-muted text-muted-foreground rounded-xl font-mono text-sm"
                />
              </div>

              {formData.type === "Categoria" && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-[#01034a]">Ícone</Label>
                  <div className="bg-white border border-muted p-4 rounded-2xl">
                    <div className="relative mb-4">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar ícone..." 
                        className="pl-10 h-10 rounded-xl bg-muted/30 border-none"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                      />
                    </div>
                    <div className="h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {iconsList.map((group, i) => (
                         <div key={i} className="mb-4 last:mb-0">
                           <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{group.category}</h4>
                           <div className="flex flex-wrap gap-2">
                             {group.icons.map((icon, j) => (
                               <button
                                 key={j}
                                 onClick={() => setFormData(prev => ({...prev, icon}))}
                                 className={`h-10 w-10 text-xl flex items-center justify-center rounded-xl transition-all ${formData.icon === icon ? 'bg-[#facc15] text-[#1a1a2e] scale-110 shadow-md border-2 border-[#eab308]' : 'bg-muted/20 hover:bg-muted/50 hover:scale-110'}`}
                               >
                                 {icon}
                               </button>
                             ))}
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Foto de Capa */}
              {formData.type === "Categoria" && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-[#01034a]">Foto de Capa</Label>
                  <p className="text-sm text-muted-foreground mb-2">Imagem exibida na vitrine da loja e página da categoria. Recomendado: 600×400px</p>
                  
                  {!formData.imageUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-[180px] bg-[#fafafa] border-2 border-dashed border-[#ddd] rounded-xl cursor-pointer hover:border-[#01034a] transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="mb-1 text-sm text-muted-foreground font-medium">📷 Arraste uma imagem</p>
                        <p className="text-xs text-muted-foreground mb-2">ou clique para selecionar</p>
                        <p className="text-[10px] text-muted-foreground/70 uppercase font-bold tracking-wider">JPG, PNG ou WebP • Máx 2MB</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert("Imagem muito grande. Máximo 2MB.");
                              return;
                            }
                            const url = URL.createObjectURL(file);
                            setFormData(prev => ({...prev, imageUrl: url}));
                          }
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-[180px] rounded-xl overflow-hidden group border border-muted/50">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-4 pb-4">
                        <label className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors backdrop-blur-sm text-sm font-medium">
                          <UploadCloud className="w-4 h-4" /> Trocar
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/jpeg, image/png, image/webp" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  alert("Imagem muito grande. Máximo 2MB.");
                                  return;
                                }
                                const url = URL.createObjectURL(file);
                                setFormData(prev => ({...prev, imageUrl: url}));
                              }
                            }}
                          />
                        </label>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, imageUrl: ""}))}
                          className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> Remover
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="font-bold text-[#01034a]">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva brevemente esta categoria para exibição na loja" 
                  className="bg-white border-muted focus:border-[#01034a] rounded-xl resize-none min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  maxLength={300}
                />
                <div className={`text-right text-xs ${300 - formData.description.length < 20 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                  {formData.description.length}/300
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="font-bold text-[#01034a]">Ordem de Exibição</Label>
                <Input 
                  id="order" 
                  type="number"
                  className="bg-white h-12 border-muted focus:border-[#01034a] rounded-xl w-32"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({...prev, order: parseInt(e.target.value) || 0}))}
                />
                <p className="text-xs text-muted-foreground">Menor número aparece primeiro</p>
              </div>

              <div className="space-y-4 pt-4 md:col-span-2 border-t border-muted/50">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-muted shadow-sm">
                  <div>
                    <Label className="font-bold text-[#01034a] text-base mb-1 block">Status da Categoria</Label>
                    <p className="text-sm text-muted-foreground">
                      Categorias inativas e seus produtos não serão exibidos na loja.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

            </div>
          </div>
          
          <div className="bg-white p-6 border-t border-muted flex justify-between sm:justify-between items-center w-full">
             <div>
                {editingId && (
                  <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-12 px-6 rounded-xl" onClick={() => {
                    deleteCategory(editingId);
                    setIsFormOpen(false);
                  }}>
                    Excluir Categoria
                  </Button>
                )}
             </div>
             <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl h-12 px-6 border-muted text-gray-600 hover:bg-gray-50">
                Cancelar
              </Button>
              <Button 
                onClick={saveCategory} 
                disabled={!formData.name || (formData.type === "Subcategoria" && !formData.parentId)} 
                className="bg-[#01034a] text-white hover:bg-[#01034a]/90 font-bold rounded-xl h-12 px-8 shadow-lg shadow-[#01034a]/20"
              >
                Salvar {formData.type}
              </Button>
             </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01034a]">Categorias</h1>
          <p className="text-muted-foreground mt-1">Gerencie as categorias e subcategorias dos produtos.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl h-12 px-6 gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
            onClick={() => { setSyncDialogOpen(true); setSyncResult(null); setSyncDirection('idle'); }}
            data-testid="btn-sync-bling"
          >
            <CloudUpload className="h-4 w-4" /> Sincronizar Bling
            {unsyncedTotal > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{unsyncedTotal}</span>
            )}
          </Button>
          <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-muted hover:bg-muted/20">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <Button onClick={() => openForm()} className="bg-[#01034a] text-white hover:bg-[#01034a]/90 rounded-xl gap-2 h-12 px-6 shadow-lg shadow-[#01034a]/20">
            <Plus className="h-5 w-5" /> Nova Categoria
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar categoria..." 
            className="pl-10 h-10 rounded-xl bg-muted/30 border-muted focus:bg-white transition-all w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center w-full md:w-auto">
          <div className="bg-muted/30 p-1 rounded-xl flex gap-1 mr-2">
            {["Todas", "Ativas", "Inativas"].map(status => (
              <Button 
                key={status} 
                variant="ghost" 
                size="sm" 
                className={`rounded-lg h-8 px-3 ${filterStatus === status ? 'bg-white shadow-sm text-[#01034a] font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
          <div className="bg-muted/30 p-1 rounded-xl flex gap-1 mr-4">
            {["Todas", "Categorias", "Subcategorias"].map(level => (
              <Button 
                key={level} 
                variant="ghost" 
                size="sm" 
                className={`rounded-lg h-8 px-3 ${filterLevel === level ? 'bg-white shadow-sm text-[#01034a] font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setFilterLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-muted p-1 rounded-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-lg ${viewMode === 'table' ? 'bg-[#01034a]/10 text-[#01034a]' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-lg ${viewMode === 'cards' ? 'bg-[#01034a]/10 text-[#01034a]' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground px-1">
        {filtered.length} {filterLevel === 'Subcategorias' 
          ? (filtered.length === 1 ? 'subcategoria encontrada' : 'subcategorias encontradas') 
          : (filtered.length === 1 ? 'categoria encontrada' : 'categorias encontradas')}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-4 text-4xl">🏷️</div>
          <h3 className="text-xl font-bold text-[#01034a] mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-muted-foreground max-w-md mb-6">Não encontramos nenhuma categoria correspondente aos filtros atuais ou você ainda não cadastrou nenhuma.</p>
          <Button onClick={() => openForm()} className="bg-[#01034a] text-white hover:bg-[#01034a]/90 rounded-xl">
            + Criar primeira categoria
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-[#01034a] font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 rounded-tl-3xl w-12"></th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4 text-center">Subcategorias</th>
                  <th className="px-6 py-4 text-center">Produtos</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Status Bling</th>
                  <th className="px-6 py-4 text-center">Ordem</th>
                  <th className="px-6 py-4 text-right rounded-tr-3xl">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rootCategoriesFiltered.map(cat => (
                  <React.Fragment key={cat.id}>
                    <tr className="border-b border-muted/50 hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4">
                        {getSubcategories(cat.id).length > 0 && (
                          <button 
                            onClick={() => toggleExpand(cat.id)}
                            className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-all"
                          >
                            {expandedCategories.includes(cat.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border border-black/5 shrink-0 bg-white">
                            {cat.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-[#01034a] text-base leading-none">{cat.name}</span>
                              <Badge variant="outline" className="bg-blue-50/50 text-blue-700/70 border-blue-200/50 text-[9px] px-1.5 py-0 h-4 rounded-md font-medium uppercase tracking-wider">Categoria</Badge>
                            </div>
                            <div className="text-muted-foreground text-xs font-mono">{cat.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cat.subcategories > 0 ? (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">{cat.subcategories} sub</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cat.products > 0 ? (
                          <span className="font-medium text-[#01034a]">{cat.products}</span>
                        ) : (
                          <span className="text-muted-foreground">Nenhum</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <Badge className={`rounded-lg px-2.5 py-0.5 border shadow-sm ${
                           cat.status === 'Ativa' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                         }`}>
                           {cat.status}
                         </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <Badge className={`rounded-lg px-2.5 py-0.5 border shadow-sm ${
                           cat.blingId ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'
                         }`} data-testid={`badge-bling-status-${cat.id}`}>
                           {cat.blingId ? 'Sincronizado' : 'Não sincronizado'}
                         </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-[#01034a]"><ArrowUp className="h-3 w-3" /></button>
                          <span className="font-mono w-6 text-center">{cat.order}</span>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-[#01034a]"><ArrowDown className="h-3 w-3" /></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-xl h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-muted min-w-[160px]">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => openForm(cat)}><Edit className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer"><Copy className="h-4 w-4 mr-2" /> Duplicar</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer"><SearchIcon className="h-4 w-4 mr-2" /> Ver Produtos</DropdownMenuItem>
                            {!cat.blingId && (
                              <DropdownMenuItem
                                className="cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                disabled={pushingCategoryId === cat.id}
                                onClick={() => pushToBlingMutation.mutate(cat.id)}
                                data-testid={`push-bling-${cat.id}`}
                              >
                                {pushingCategoryId === cat.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CloudUpload className="h-4 w-4 mr-2" />}
                                Enviar ao Bling
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" onClick={() => deleteCategory(cat.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    
                    {/* Render subcategories if expanded */}
                    {expandedCategories.includes(cat.id) && getSubcategories(cat.id).map(sub => (
                      <tr key={sub.id} className="border-b border-muted/50 bg-muted/5 hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 pl-6 relative">
                            {/* Hierarchy connector line */}
                            <div className="absolute left-[-16px] top-[-24px] w-[20px] h-[44px] border-l-2 border-b-2 border-muted-foreground/30 rounded-bl-lg"></div>
                            
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{cat.name}</div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-[#01034a] text-sm leading-none">{sub.name}</span>
                                <Badge variant="outline" className="bg-gray-50/50 text-gray-500 border-gray-200/50 text-[9px] px-1.5 py-0 h-4 rounded-md font-medium uppercase tracking-wider">Subcategoria</Badge>
                              </div>
                              <div className="text-muted-foreground text-xs font-mono">{sub.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-muted-foreground">—</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {sub.products > 0 ? (
                            <span className="font-medium text-[#01034a]">{sub.products}</span>
                          ) : (
                            <span className="text-muted-foreground">Nenhum</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <Badge className={`rounded-lg px-2.5 py-0.5 border shadow-sm ${
                             sub.status === 'Ativa' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                           }`}>
                             {sub.status}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <Badge className={`rounded-lg px-2.5 py-0.5 border shadow-sm ${
                             sub.blingId ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'
                           }`} data-testid={`badge-bling-status-${sub.id}`}>
                             {sub.blingId ? 'Sincronizado' : 'Não sincronizado'}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-[#01034a]"><ArrowUp className="h-3 w-3" /></button>
                            <span className="font-mono w-6 text-center">{sub.order}</span>
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-[#01034a]"><ArrowDown className="h-3 w-3" /></button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-muted rounded-xl h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-muted min-w-[160px]">
                              <DropdownMenuItem className="cursor-pointer" onClick={() => openForm(sub)}><Edit className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer"><Copy className="h-4 w-4 mr-2" /> Duplicar</DropdownMenuItem>
                              {!sub.blingId && (
                                <DropdownMenuItem
                                  className={`cursor-pointer ${cat.blingId ? 'text-blue-600 focus:text-blue-600 focus:bg-blue-50' : 'text-gray-400'}`}
                                  disabled={!cat.blingId || pushingCategoryId === sub.id}
                                  onClick={() => cat.blingId && pushToBlingMutation.mutate(sub.id)}
                                  title={!cat.blingId ? 'Sincronize a categoria pai primeiro' : ''}
                                  data-testid={`push-bling-${sub.id}`}
                                >
                                  {pushingCategoryId === sub.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CloudUpload className="h-4 w-4 mr-2" />}
                                  Enviar ao Bling
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" onClick={() => deleteCategory(sub.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-muted/10 p-4 border-t border-muted flex items-center justify-center text-sm text-muted-foreground">
            Página 1 de 1 (Mostrando {filtered.length} {filterLevel === 'Subcategorias' ? 'subcategorias' : 'categorias'})
          </div>
        </Card>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filtered.map(cat => (
            <Card key={cat.id} className="border border-muted/30 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 group">
              <div className="p-4 w-full flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="text-[36px] leading-none shrink-0">
                    {cat.parentId ? rootCategories.find(c => c.id === cat.parentId)?.icon : cat.icon}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 
                      className="font-bold text-[14px] text-[#1a1a2e] leading-tight" 
                      style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                      }}
                      title={cat.name}
                    >
                      {cat.name}
                    </h3>
                    <div className="text-[#b0b0b0] text-[11px] font-mono leading-tight mt-0.5 truncate">
                      {cat.parentId ? (
                        <div 
                          className="text-[#999] flex items-center gap-1"
                          style={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 1, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden' 
                          }}
                        >
                          <span className="text-[12px] leading-none shrink-0">{rootCategories.find(c => c.id === cat.parentId)?.icon}</span>
                          <span className="truncate">{rootCategories.find(r => r.id === cat.parentId)?.name}</span>
                        </div>
                      ) : cat.slug}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[11px] text-[#888]">
                      {cat.products} produtos {cat.parentId === null && `• ${cat.subcategories} sub`}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${cat.status === 'Ativa' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-[10px] ${cat.status === 'Ativa' ? 'text-green-500' : 'text-gray-500'}`}>
                        {cat.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${cat.blingId ? 'bg-blue-500' : 'bg-orange-400'}`}></div>
                      <span className={`text-[10px] ${cat.blingId ? 'text-blue-500' : 'text-orange-400'}`}>
                        {cat.blingId ? 'Bling' : 'Sem Bling'}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#ccc] hover:bg-muted hover:text-[#1a1a2e]">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-muted min-w-[160px]">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => openForm(cat)}><Edit className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Copy className="h-4 w-4 mr-2" /> Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><SearchIcon className="h-4 w-4 mr-2" /> Ver Produtos</DropdownMenuItem>
                      {!cat.blingId && (
                        <DropdownMenuItem
                          className={`cursor-pointer ${(!cat.parentId || rootCategories.find(c => c.id === cat.parentId)?.blingId) ? 'text-blue-600 focus:text-blue-600 focus:bg-blue-50' : 'text-gray-400'}`}
                          disabled={!!(cat.parentId && !rootCategories.find(c => c.id === cat.parentId)?.blingId) || pushingCategoryId === cat.id}
                          onClick={() => {
                            if (cat.parentId && !rootCategories.find(c => c.id === cat.parentId)?.blingId) return;
                            pushToBlingMutation.mutate(cat.id);
                          }}
                          title={cat.parentId && !rootCategories.find(c => c.id === cat.parentId)?.blingId ? 'Sincronize a categoria pai primeiro' : ''}
                          data-testid={`push-bling-card-${cat.id}`}
                        >
                          {pushingCategoryId === cat.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CloudUpload className="h-4 w-4 mr-2" />}
                          Enviar ao Bling
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" onClick={() => deleteCategory(cat.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={syncDialogOpen} onOpenChange={(open) => { if (syncDirection === 'idle') setSyncDialogOpen(open); }}>
        <AlertDialogContent className="max-w-lg rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#01034a] flex items-center gap-2">
              <CloudUpload className="h-5 w-5 text-blue-600" />
              Sincronizar Categorias com Bling
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Escolha a direção da sincronização. Esta ação pode alterar dados no sistema ou no Bling.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <div className="border rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <UploadCloud className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-[#01034a]">Sistema → Bling</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Envia <strong>{unsyncedParents.length} categorias</strong> e <strong>{unsyncedSubs.length} subcategorias</strong> que não estão no Bling.
                    Categorias já existentes no Bling não serão alteradas.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 shrink-0"
                  disabled={syncDirection !== 'idle' || unsyncedTotal === 0}
                  onClick={handlePushAll}
                  data-testid="btn-push-to-bling"
                >
                  {syncDirection === 'pushing' ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Enviando...</>
                  ) : (
                    'Enviar'
                  )}
                </Button>
              </div>
              {unsyncedTotal === 0 && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  Todas as categorias já estão sincronizadas!
                </p>
              )}
            </div>

            <div className="border rounded-xl p-4 hover:border-green-300 hover:bg-green-50/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-[#01034a]">Bling → Sistema</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Importa categorias do Bling para o sistema. Categorias com mesmo nome serão vinculadas automaticamente, sem duplicar.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 shrink-0"
                  disabled={syncDirection !== 'idle'}
                  onClick={handlePull}
                  data-testid="btn-pull-from-bling"
                >
                  {syncDirection === 'pulling' ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Importando...</>
                  ) : (
                    'Importar'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {syncResult && (
            <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
              {syncResult.pushed !== undefined && (
                <p><strong>{syncResult.pushed}</strong> categorias enviadas{syncResult.errors ? `, ${syncResult.errors} erros` : ''}</p>
              )}
              {syncResult.synced !== undefined && (
                <p><strong>{syncResult.synced}</strong> categorias importadas do Bling</p>
              )}
              {syncResult.details && syncResult.details.length > 0 && (
                <div className="max-h-40 overflow-y-auto text-xs space-y-0.5 mt-1 border-t pt-2">
                  {syncResult.details.map((d, i) => (
                    <p key={i} className={d.startsWith('✓') ? 'text-green-700' : 'text-red-600'}>{d}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={syncDirection !== 'idle'} className="rounded-lg">
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
