import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TeamMemberForm from "./TeamMemberForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Users,
  UserX,
  MailWarning,
  Link as LinkIcon,
  Filter,
  Search,
  Plus,
  MessageCircle,
  Pencil,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useLocation } from "wouter";

// --- Tipos Mockados ---
type MemberStatus = "Ativo" | "Inativo" | "Pendente";
type CredentialStatus = "Na fila" | "Enviando" | "Enviado" | "Entregue" | "Acessado" | "Falhou" | "Não enviado";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  whatsapp: string;
  admissionDate: string;
  lastAccess: string | null;
  status: MemberStatus;
  avatar?: string;
}

interface InviteLink {
  id: string;
  role: string;
  url: string;
  uses: number;
  maxUses: number | null;
  expiresAt: string;
  createdAt: string;
}

interface CredentialHistory {
  id: string;
  recipientName: string;
  recipientEmail: string;
  phone: string;
  status: CredentialStatus;
  sentAt: string;
  accessedAt: string | null;
  createdAt: string;
  deliveredAt: string | null;
  errorMessage?: string;
}

// --- Dados Mockados ---
const mockMembers: TeamMember[] = [
  { id: "1", name: "Diogo Henrique Paiva Brito", email: "diogo-paiva@hotmail.com", role: "Consultor", whatsapp: "13981099970", admissionDate: "13/02/2026", lastAccess: null, status: "Pendente" },
  { id: "2", name: "Vendedor Teste", email: "test-vendedor@nooklead.dev", role: "Consultor", whatsapp: "-", admissionDate: "13/02/2026", lastAccess: "18/02/2026 16:19", status: "Ativo" },
  { id: "3", name: "Gestor Teste", email: "test-gestor@nooklead.dev", role: "Supervisor", whatsapp: "-", admissionDate: "05/02/2026", lastAccess: null, status: "Ativo" },
  { id: "4", name: "Admin Teste", email: "test-admin@nooklead.dev", role: "Master", whatsapp: "-", admissionDate: "05/02/2026", lastAccess: "23/02/2026 16:54", status: "Ativo" },
  { id: "5", name: "Super", email: "admin@nooklead.com.br", role: "Administrador", whatsapp: "11999999999", admissionDate: "11/11/2025", lastAccess: null, status: "Pendente" },
];

const mockInvites: InviteLink[] = [
  { id: "1", role: "Consultor", url: "https://latem.com.br/invite/x7y8z", uses: 2, maxUses: 5, expiresAt: "28/02/2026", createdAt: "20/02/2026" }
];

const mockHistory: CredentialHistory[] = [
  { id: "1", recipientName: "Diogo Henrique", recipientEmail: "diogo-paiva@hotmail.com", phone: "13981099970", status: "Entregue", sentAt: "23/02/2026 10:00", accessedAt: null, createdAt: "23/02/2026 09:55", deliveredAt: "23/02/2026 10:01" },
  { id: "2", recipientName: "Super", recipientEmail: "admin@nooklead.com.br", phone: "11999999999", status: "Falhou", sentAt: "-", accessedAt: null, createdAt: "22/02/2026 14:00", deliveredAt: null, errorMessage: "Número inválido" }
];

export default function TeamTab() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("membros");
  
  const { data: members = [] } = useQuery<any[]>({ queryKey: ["/api/team-members"] });
  
  const deleteMemberMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/team-members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      setIsDisableAlertOpen(false);
    },
  });

  const handleDeleteMember = () => {
    if (memberToDisable) {
      deleteMemberMutation.mutate(parseInt(memberToDisable));
    }
  };

  // Estados para Filtros de Membros
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  
  // Estado para Paginação (mock)
  const [itemsPerPage, setItemsPerPage] = useState("5");
  
  // Estados de Modais
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [isDisableAlertOpen, setIsDisableAlertOpen] = useState(false);
  const [isRemoveInviteAlertOpen, setIsRemoveInviteAlertOpen] = useState(false);
  const [memberToDisable, setMemberToDisable] = useState<string | null>(null);
  
  // View State (list, create, edit)
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  // Filtro Frontend (useMemo)
  const filteredMembers = useMemo(() => {
    return members.filter((member: any) => {
      const matchName = member.name.toLowerCase().includes(searchName.toLowerCase()) || 
                        member.email.toLowerCase().includes(searchName.toLowerCase()) ||
                        member.role.toLowerCase().includes(searchName.toLowerCase());
      const matchStatus = statusFilter === "Todos" || member.status === statusFilter;
      return matchName && matchStatus;
    });
  }, [members, searchName, statusFilter]);

  // Helpers de Badge
  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case "Ativo": return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Ativo</Badge>;
      case "Inativo": return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none">Inativo</Badge>;
      case "Pendente": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Pendente</Badge>;
    }
  };

  const getHistoryStatusBadge = (status: CredentialStatus) => {
    switch (status) {
      case "Entregue": return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none flex gap-1"><CheckCircle2 className="w-3 h-3"/> Entregue</Badge>;
      case "Falhou": return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none flex gap-1"><XCircle className="w-3 h-3"/> Falhou</Badge>;
      case "Na fila": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none flex gap-1"><Clock className="w-3 h-3"/> Na fila</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (currentView === "create" || currentView === "edit") {
    return <TeamMemberForm 
      isEditing={currentView === "edit"} 
      memberId={editingMemberId} 
      onBack={() => {
        setCurrentView("list");
        setEditingMemberId(null);
      }} 
    />;
  }

  return (
    <div className="w-full">
          {/* Header e Top Cards */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-[#01034a]">
                  Gestão da Equipe
                </h1>
                <p className="text-muted-foreground mt-1">Gerencie membros, convites e acessos.</p>
              </div>
              <Button 
                onClick={() => setCurrentView("create")}
                className="bg-[#01034a] text-white hover:bg-[#01034a]/90 rounded-xl shadow-lg shadow-[#01034a]/20 h-12 px-6"
              >
                <Plus className="w-5 h-5 mr-2" /> Adicionar Membro
              </Button>
            </div>
          </div>

          {/* Abas */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Aba: Membros */}
            <TabsContent value="membros" className="space-y-4 outline-none">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white mt-4">
                
                {/* Filtros */}
                <div className="p-4 border-b border-muted/50 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="rounded-lg h-9 bg-muted/20 border-muted hover:bg-muted/40 text-muted-foreground hover:text-foreground">
                      Todos
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 text-muted-foreground hover:text-foreground">
                      Ativos
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 text-muted-foreground hover:text-foreground">
                      Inativos
                    </Button>
                  </div>
                  <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar membro ou cargo..." 
                      className="pl-10 h-10 rounded-xl bg-muted/30 border-muted focus:bg-white transition-all"
                      value={searchName}
                      onChange={e => setSearchName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-primary">Membro</TableHead>
                        <TableHead className="font-semibold text-primary">Cargo</TableHead>
                        <TableHead className="font-semibold text-primary">WhatsApp</TableHead>
                        <TableHead className="font-semibold text-primary">Data Admissão</TableHead>
                        <TableHead className="font-semibold text-primary">Último Acesso</TableHead>
                        <TableHead className="font-semibold text-primary">Status</TableHead>
                        <TableHead className="font-semibold text-primary text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                {member.name.substring(0, 2)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-primary">{member.name}</span>
                                <span className="text-xs text-muted-foreground">{member.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{member.role}</TableCell>
                          <TableCell className="text-sm">{member.whatsapp}</TableCell>
                          <TableCell className="text-sm">{member.admissionDate}</TableCell>
                          <TableCell>
                            {member.lastAccess ? (
                              <span className="text-sm">{member.lastAccess}</span>
                            ) : (
                              <Badge variant="outline" className="bg-muted/50 text-muted-foreground font-normal">Nunca acessou</Badge>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => setIsCredentialModalOpen(true)} title="Enviar credenciais">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => { setEditingMemberId(member.id); setCurrentView("edit"); }} title="Editar">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" title="Copiar WhatsApp">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => { setMemberToDisable(member.id); setIsDisableAlertOpen(true); }} title="Desativar">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredMembers.length === 0 && (
                         <TableRow>
                           <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                             Nenhum membro encontrado com os filtros atuais.
                           </TableCell>
                         </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Paginação */}
                <div className="p-4 border-t border-primary/5 flex items-center justify-between bg-muted/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Exibir:</span>
                    <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                      <SelectTrigger className="h-8 w-[70px] bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">pág. 1-5 de 5</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white" disabled><ChevronLeft className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white" disabled><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Aba: Convites */}
            <TabsContent value="convites" className="space-y-4 outline-none">
               <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white mt-4">
                 <div className="p-4 border-b border-primary/5 flex justify-end bg-muted/10">
                   <Button onClick={() => setIsInviteModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                     <Plus className="w-4 h-4 mr-2" /> Novo Link
                   </Button>
                 </div>
                 <div className="overflow-x-auto">
                   <Table>
                     <TableHeader className="bg-muted/30">
                       <TableRow>
                         <TableHead className="font-semibold text-primary">Cargo</TableHead>
                         <TableHead className="font-semibold text-primary">Link</TableHead>
                         <TableHead className="font-semibold text-primary">Usos</TableHead>
                         <TableHead className="font-semibold text-primary">Expira em</TableHead>
                         <TableHead className="font-semibold text-primary">Criado em</TableHead>
                         <TableHead className="font-semibold text-primary text-right">Ações</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {mockInvites.map(invite => (
                         <TableRow key={invite.id}>
                           <TableCell className="font-medium">{invite.role}</TableCell>
                           <TableCell className="text-blue-600 hover:underline cursor-pointer text-sm">{invite.url}</TableCell>
                           <TableCell className="text-sm">{invite.uses} / {invite.maxUses || "∞"}</TableCell>
                           <TableCell className="text-sm">{invite.expiresAt}</TableCell>
                           <TableCell className="text-sm">{invite.createdAt}</TableCell>
                           <TableCell>
                             <div className="flex justify-end gap-1">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" title="Copiar Link">
                                 <Copy className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setIsRemoveInviteAlertOpen(true)} title="Remover Link">
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </div>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               </Card>
            </TabsContent>

            {/* Aba: Histórico */}
            <TabsContent value="historico" className="space-y-4 outline-none">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white mt-4">
                 <div className="overflow-x-auto">
                   <Table>
                     <TableHeader className="bg-muted/30">
                       <TableRow>
                         <TableHead className="font-semibold text-primary">Destinatário</TableHead>
                         <TableHead className="font-semibold text-primary">Telefone</TableHead>
                         <TableHead className="font-semibold text-primary">Status</TableHead>
                         <TableHead className="font-semibold text-primary">Enviado em</TableHead>
                         <TableHead className="font-semibold text-primary">Acessado em</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {mockHistory.map(hist => (
                         <TableRow key={hist.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                           <TableCell>
                             <div className="flex flex-col">
                               <span className="font-bold text-sm text-primary">{hist.recipientName}</span>
                               <span className="text-xs text-muted-foreground">{hist.recipientEmail}</span>
                             </div>
                           </TableCell>
                           <TableCell className="text-sm">{hist.phone}</TableCell>
                           <TableCell>{getHistoryStatusBadge(hist.status)}</TableCell>
                           <TableCell className="text-sm">{hist.sentAt}</TableCell>
                           <TableCell className="text-sm">{hist.accessedAt || "-"}</TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
              </Card>
            </TabsContent>
          </Tabs>

      {/* Modais e Dialogs */}

      {/* Modal: Novo Link de Convite */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Novo Link de Convite</DialogTitle>
            <DialogDescription>Crie um link para que novos membros se cadastrem sozinhos na equipe.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo a ser atribuído</label>
              <Select defaultValue="Consultor">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultor">Consultor</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Limite de usos (opcional)</label>
              <Input type="number" placeholder="Ex: 5" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsInviteModalOpen(false)}>Criar Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Credenciais (Blue Gradient) */}
      <Dialog open={isCredentialModalOpen} onOpenChange={setIsCredentialModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-none rounded-2xl shadow-2xl p-0 overflow-hidden">
          <div className="bg-[#0B132B] pt-8 pb-12 px-8 text-left relative">
            <div className="absolute right-6 bottom-0 w-28 h-28 pointer-events-none z-30 translate-y-4">
              <img src="/mascot.png" alt="Mascote" className="w-full h-full object-contain object-bottom drop-shadow-2xl" />
            </div>
            
            <div className="relative z-10 pr-24">
              <DialogTitle className="text-2xl font-display font-bold mb-1 text-[#fdd700]">Credenciais Geradas</DialogTitle>
              <DialogDescription className="text-white/90 text-xs leading-relaxed">
                As credenciais para <strong>Diogo Henrique</strong> aparecerão apenas uma vez. Copie e envie com segurança.
              </DialogDescription>
            </div>
          </div>
          
          <div className="px-8 py-6 space-y-5 bg-white relative z-20 -mt-4 rounded-t-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Link de Acesso</span>
                <span className="font-mono text-sm text-[#01034a] font-medium bg-gray-50 px-3 py-1 rounded-md">https://latem.com.br/login</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">E-mail</span>
                <span className="font-mono text-sm text-[#01034a] font-medium">diogo-paiva@hotmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Senha Temporária</span>
                <span className="font-mono text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">T3mp@2026</span>
              </div>
            </div>

            <div className="flex gap-3 w-full pt-4 mt-2">
              <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 h-11 rounded-xl" onClick={() => setIsCredentialModalOpen(false)}>Fechar</Button>
              <Button className="flex-1 bg-[#01034a] hover:bg-[#01034a]/90 text-white border-none h-11 rounded-xl shadow-lg shadow-[#01034a]/20">
                <Copy className="w-4 h-4 mr-2" /> Copiar Tudo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert: Desativar Membro */}
      <AlertDialog open={isDisableAlertOpen} onOpenChange={setIsDisableAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Desativar Membro
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar este membro? Ele perderá acesso ao sistema imediatamente, mas o histórico será mantido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleDeleteMember}
              disabled={deleteMemberMutation.isPending}
            >
              {deleteMemberMutation.isPending ? "Removendo..." : "Desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert: Remover Link */}
      <AlertDialog open={isRemoveInviteAlertOpen} onOpenChange={setIsRemoveInviteAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Link de Convite</AlertDialogTitle>
            <AlertDialogDescription>
              Este link será invalidado imediatamente. Qualquer pessoa tentando usá-lo não conseguirá se cadastrar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsRemoveInviteAlertOpen(false)}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}