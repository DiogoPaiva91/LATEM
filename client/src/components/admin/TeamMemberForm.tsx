import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Briefcase, 
  Phone, 
  Calendar, 
  Hash, 
  Mail, 
  MapPin, 
  FileText, 
  Camera,
  ArrowLeft,
  MessageCircle
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface TeamMemberFormProps {
  isEditing?: boolean;
  memberId?: string | null;
  onBack: () => void;
}

export default function TeamMemberForm({ isEditing = false, memberId, onBack }: TeamMemberFormProps) {
  const [location, setLocation] = useLocation();

  // Mock initial state for editing
  const [isActive, setIsActive] = useState(true);
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);

  return (
    <div className="w-full relative">
      <div className="bg-[#0B132B] pt-12 pb-32 px-4 -mx-8 -mt-8 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-muted-foreground relative group cursor-pointer shadow-sm">
                <User className="w-8 h-8" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-1">
                  {isEditing ? "Editar Membro" : "Adicionar Membro"}
                </h1>
                <p className="text-sm text-white/70">
                  {isEditing ? "Atualize as informações do usuário." : "Vincule um usuário existente ou crie um novo usuário."}
                </p>
              </div>
            </div>
            
            <Button variant="ghost" onClick={onBack} className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10 pb-12">
        <Card className="p-8 border-none shadow-xl rounded-3xl bg-white relative">
            {/* Mascote Sentado na Borda */}
            <div className="absolute right-12 bottom-full mb-0 w-32 h-32 hidden md:block pointer-events-none z-20 translate-y-1">
              <img 
                src="/mascot.png" 
                alt="Mascote" 
                className="w-full h-full object-contain object-bottom drop-shadow-xl"
              />
            </div>
            
            <div className="space-y-8">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input placeholder="Nome completo" className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl" defaultValue={isEditing ? "Vendedor Teste" : ""} />
                </div>
                
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" /> Cargo <span className="text-red-500">*</span>
                  </Label>
                  <Select defaultValue={isEditing ? "consultor" : undefined}>
                    <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultor">Consultor</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" /> WhatsApp <span className="text-red-500">*</span>
                  </Label>
                  <Input placeholder="(00) 00000-0000" className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl" defaultValue={isEditing ? "11999999999" : ""} />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" /> Data Admissão <span className="text-red-500">*</span>
                  </Label>
                  <Input type="date" className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl" defaultValue={isEditing ? "2026-02-13" : "2026-02-23"} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> Perfil de Acesso
                  </Label>
                  <Select defaultValue="consultor">
                    <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultor">Consultor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" /> Matrícula
                  </Label>
                  <Input placeholder="# Número da matrícula" className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl" />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" /> E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input type="email" placeholder="usuario@email.com" className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl" defaultValue={isEditing ? "test-vendedor@nooklead.dev" : ""} />
                </div>

                <div className="space-y-2 md:col-span-1 flex flex-col justify-center pt-6">
                  <div className="flex items-center gap-3">
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                    <Label className={`font-semibold ${isActive ? "text-green-600" : "text-muted-foreground"}`}>
                      {isActive ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Endereço
                </Label>
                <Input placeholder="Endereço completo" className="h-11 bg-white border-gray-200 focus:border-primary transition-colors rounded-xl" />
              </div>

              {/* Row 4 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" /> Observação
                </Label>
                <Textarea placeholder="Observações sobre o membro" className="bg-white border-gray-200 focus:border-primary transition-colors rounded-xl min-h-[100px] resize-none" />
              </div>

              {/* WhatsApp Checkbox (Only on create) */}
              {!isEditing && (
                <div className="bg-green-50/50 border border-green-200/50 rounded-xl p-4 flex items-start gap-3 mt-8">
                  <Checkbox 
                    id="send-whatsapp" 
                    checked={sendViaWhatsApp} 
                    onCheckedChange={(c) => setSendViaWhatsApp(c as boolean)}
                    className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div>
                    <Label htmlFor="send-whatsapp" className="font-semibold text-green-800 flex items-center gap-2 cursor-pointer">
                      <MessageCircle className="w-4 h-4" /> Enviar credenciais via WhatsApp
                    </Label>
                    <p className="text-xs text-green-700/80 mt-1">
                      O novo membro receberá um link para definir sua senha no WhatsApp cadastrado
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-primary/5 mt-8">
                <Button variant="outline" onClick={onBack} className="h-11 px-6 rounded-xl">
                  Cancelar
                </Button>
                <Button 
                  className={`h-11 px-8 rounded-xl font-bold text-white shadow-lg shadow-black/5 ${isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
                  onClick={onBack}
                >
                  {isEditing ? "Salvar Alterações" : "Adicionar Membro"}
                </Button>
              </div>

            </div>
          </Card>
        </div>
    </div>
  );
}