# UX Design Patterns — CONTPIX

Padrões visuais e de interação para manter consistência em todos os projetos.

---

## 1. Modal Pattern (TaskModal / FormModal)

### Estrutura & Layout
- **Largura:** `sm:max-w-[680px]`
- **Border-radius:** `rounded-2xl` (16px)
- **Padding:** `px-7` para body e footer
- **Animação de entrada:** `animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300`

### Header
- **Ícone circular:** `w-12 h-12 rounded-full bg-primary/10 text-primary`
- **Título:** `text-xl font-bold`
- **Subtítulo:** `text-sm text-muted-foreground`
- **Botão X:** Posição absoluta `top-3 right-3`, tamanho `w-8 h-8`
- **Border inferior:** `border-b border-border/50`

### Campos de Formulário
- **Labels:** Sempre acima dos campos — `text-sm font-semibold`
- **Campos obrigatórios:** `<span className="text-destructive">*</span>`
- **Altura dos inputs:** `h-11`
- **Border-radius dos inputs:** `rounded-xl`
- **Ícone à esquerda:** `absolute left-3.5 top-1/2 -translate-y-1/2`
- **Padding com ícone:** `pl-10`
- **Focus state:** `focus:border-primary focus:ring-2 focus:ring-primary/20`
- **Animação staggered:** `animate-in fade-in-0 slide-in-from-bottom-2` com `animationDelay`

### Ícones por Campo
| Campo | Ícone |
|---|---|
| Título / Ação | `<Zap />` |
| Cliente / Pessoa | `<User />` |
| Departamento | `<Building2 />` |
| Responsável | `<Users />` |
| Data | `<Calendar />` |
| Status | `<Columns3 />` |
| Progresso | `<BarChart3 />` |
| Descrição | `<AlignLeft />` |

### Tipo como Tabs
- **Container:** `flex gap-2 p-1 bg-muted/50 rounded-xl`
- **Tab ativa:** `bg-background text-primary shadow-sm`
- **Tab inativa:** `text-muted-foreground hover:text-foreground`
- Cada tab com ícone + texto

### Prioridade Visual (Botões)

```typescript
const priorityConfig = {
  low: {
    label: "Baixa",
    color: "border-slate-300 bg-slate-50 text-slate-600",
    dotColor: "bg-slate-400"
  },
  medium: {
    label: "Média",
    color: "border-blue-400 bg-blue-50 text-blue-600",
    dotColor: "bg-blue-500"
  },
  high: {
    label: "Alta",
    color: "border-amber-400 bg-amber-50 text-amber-600",
    dotColor: "bg-amber-500"
  },
  urgent: {
    label: "Urgente",
    color: "border-red-400 bg-red-50 text-red-600",
    dotColor: "bg-red-500"
  }
};
```

- **Botões lado a lado:** `flex gap-2`
- **Bolinha colorida:** `w-2 h-2 rounded-full`
- **Border ativo:** `border-2`

### Slider de Progresso
- **Track:** `h-1.5 bg-muted rounded-full`
- **Thumb:** `w-5 h-5 rounded-full bg-primary shadow-lg shadow-primary/30`
- **Hover:** `hover:scale-110`
- **Valor à direita:** `text-sm font-semibold text-muted-foreground`

### Footer
- **Background:** `bg-[#fafbfc]`
- **Border superior:** `border-t border-border/50`
- **Dica de atalho:** À esquerda com `<kbd>` estilizado
- **Botões:** À direita — Cancelar (outline) + Salvar (primary com ícone `Check`)
- **Border-radius botões:** `rounded-xl`

### Atalho de Teclado
- `⌘ + Enter` (Mac) ou `Ctrl + Enter` (Windows) para salvar

---

## 2. Filter Modal Pattern (TaskFiltersModal)

### Estrutura
- **Largura:** `max-w-4xl`
- **Título de seção:** `text-sm font-medium text-muted-foreground uppercase tracking-wider`
- **Separador:** `<Separator />` após título
- **Grid:** `grid grid-cols-2 gap-4` para campos relacionados

### Campos de Filtro
- Inputs de texto para busca
- Selects com opção **"Todos"** como default (`value="all"`)
- Inputs de data para período (início / fim)

### Interface de Filtros

```typescript
interface TaskFilters {
  titulo: string;
  cliente: string;
  clientType: string;    // "all" | "internal" | "external"
  tipo: string;
  departamento: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  prioridade: string;
  status: string;
}
```

### Indicador de Filtros Ativos
- **Botão com destaque:** `border-primary text-primary`
- **Badge indicador:** `text-xs bg-primary text-primary-foreground rounded-full px-1.5`
- **Botão X para limpar:** `variant="ghost" size="icon"`

### Footer do Filtro
- **Botão esquerda:** "Limpar Filtros" (outline)
- **Botão direita:** "Aplicar Filtros" (primary)

---

## 3. Cores de Status

| Status | Cor |
|---|---|
| Ativo | Verde (`green`) |
| Novo | Azul (`blue`) |
| Inativo | Cinza (`gray`) |

---

## 4. Componentes Base (shadcn/ui)

- **Biblioteca:** shadcn/ui estilo **"new-york"** sobre Radix UI
- **Ícones:** Lucide React
- **Estilização:** Tailwind CSS com variáveis de tema customizadas

---

## 5. Tabelas com Colunas Customizáveis

### Visibilidade de Colunas
- Toggle on/off via dropdown **"Colunas"**
- Persistência em `localStorage`

### Reordenação de Colunas
- Drag-and-drop com `@dnd-kit`
- Persistência da ordem em `localStorage`

---

## 6. Responsividade

- Sistema totalmente responsivo: mobile, tablet e desktop
- Breakpoints padrão Tailwind: `sm`, `md`, `lg`, `xl`
- Inputs e botões adaptam tamanho conforme viewport

---

## 7. Internacionalização

- Atributo `translate="no"` em elementos que não devem ser traduzidos automaticamente
- Labels e textos em português (pt-BR)
