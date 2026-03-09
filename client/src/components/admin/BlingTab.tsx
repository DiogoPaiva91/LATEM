import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Link2,
  Unlink,
  RefreshCw,
  FolderTree,
  Package,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface BlingStatus {
  connected: boolean;
  expiresAt?: string;
  createdAt?: string;
}

export function BlingTab() {
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blingStatus = params.get("bling");
    const errorMsg = params.get("error_msg");

    if (blingStatus === "connected") {
      toast({ title: "Bling conectado!", description: "Autorização realizada com sucesso." });
      window.history.replaceState({}, "", "/admin?tab=integracoes");
    } else if (blingStatus === "error") {
      toast({
        title: "Erro na conexão com o Bling",
        description: errorMsg || "Não foi possível completar a autorização. Tente novamente.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", "/admin?tab=integracoes");
    }
  }, []);

  const { data: status, isLoading: statusLoading } = useQuery<BlingStatus>({
    queryKey: ["/api/bling/status"],
    refetchInterval: 30000,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/bling/auth-url");
      const data = await res.json();
      return data.url;
    },
    onSuccess: (url: string) => {
      window.location.href = url;
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao conectar", description: err.message, variant: "destructive" });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/bling/disconnect"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bling/status"] });
      toast({ title: "Desconectado", description: "Conexão com o Bling removida." });
    },
  });

  const handleSyncError = (err: Error, module: string) => {
    const isPermission = err.message?.includes("permissão") || err.message?.includes("403");
    toast({
      title: isPermission ? "Sem permissão no Bling" : "Erro na sincronização",
      description: isPermission
        ? `Seu usuário/plano no Bling não tem acesso ao módulo de ${module}. Peça ao administrador da conta para liberar essa permissão.`
        : err.message,
      variant: "destructive",
    });
  };

  const syncCategoriesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bling/sync/categories");
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categorias sincronizadas", description: `${data.synced} categorias importadas do Bling.` });
    },
    onError: (err: Error) => handleSyncError(err, "Categorias"),
  });

  const syncProductsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bling/sync/products");
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produtos sincronizados", description: `${data.synced} produtos importados do Bling.` });
    },
    onError: (err: Error) => handleSyncError(err, "Produtos"),
  });

  const syncAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bling/sync/all");
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });

      if (data.errors && data.errors.length > 0) {
        toast({
          title: "Sincronização parcial",
          description: `${data.categories} categorias e ${data.products} produtos importados. Avisos: ${data.errors.join("; ")}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sincronização completa",
          description: `${data.categories} categorias e ${data.products} produtos importados.`,
        });
      }
    },
    onError: (err: Error) => handleSyncError(err, "Categorias/Produtos"),
  });

  const isSyncing = syncCategoriesMutation.isPending || syncProductsMutation.isPending || syncAllMutation.isPending;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#01034a]" data-testid="text-bling-title">
            Integrações
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte o Bling ERP para sincronizar categorias, produtos e estoque.
          </p>
        </div>
      </header>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden" data-testid="card-bling-status">
        <CardHeader className="bg-[#01034a] text-white p-6">
          <CardTitle className="text-lg font-display flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-[#fdd700]" />
            </div>
            Bling ERP
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {statusLoading ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verificando conexão...
            </div>
          ) : status?.connected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-bold text-[#01034a]">Conectado</p>
                    <p className="text-xs text-muted-foreground">
                      Token expira em {formatDate(status.expiresAt)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl gap-2"
                data-testid="button-bling-disconnect"
              >
                <Unlink className="h-4 w-4" />
                {disconnectMutation.isPending ? "Desconectando..." : "Desconectar"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-bold text-[#01034a]">Desconectado</p>
                  <p className="text-xs text-muted-foreground">
                    Conecte sua conta Bling para sincronizar dados.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => connectMutation.mutate()}
                disabled={connectMutation.isPending}
                className="bg-[#01034a] text-white hover:bg-[#01034a]/90 rounded-xl gap-2 h-11 px-6 shadow-lg shadow-[#01034a]/20"
                data-testid="button-bling-connect"
              >
                <Link2 className="h-4 w-4" />
                {connectMutation.isPending ? "Redirecionando..." : "Conectar ao Bling"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {status?.connected && (
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden" data-testid="card-bling-sync">
          <CardHeader className="bg-[#0B132B] text-[#fdd700] p-6">
            <CardTitle className="text-lg font-display flex items-center gap-3">
              <RefreshCw className="h-5 w-5" />
              Sincronização
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Importe categorias e produtos do Bling para o catálogo local. A sincronização cria ou atualiza registros existentes sem duplicar.
            </p>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                A sincronização depende das permissões do seu usuário/plano no Bling. Se algum módulo (ex: Produtos) não estiver liberado, você receberá um aviso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => syncCategoriesMutation.mutate()}
                disabled={isSyncing}
                className="h-20 rounded-2xl border-2 border-[#01034a]/10 hover:border-[#01034a]/30 hover:bg-[#01034a]/5 flex flex-col items-center gap-2 transition-all"
                data-testid="button-sync-categories"
              >
                {syncCategoriesMutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#01034a]" />
                ) : (
                  <FolderTree className="h-6 w-6 text-[#01034a]" />
                )}
                <span className="text-sm font-medium text-[#01034a]">
                  {syncCategoriesMutation.isPending ? "Sincronizando..." : "Sincronizar Categorias"}
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => syncProductsMutation.mutate()}
                disabled={isSyncing}
                className="h-20 rounded-2xl border-2 border-[#01034a]/10 hover:border-[#01034a]/30 hover:bg-[#01034a]/5 flex flex-col items-center gap-2 transition-all"
                data-testid="button-sync-products"
              >
                {syncProductsMutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#01034a]" />
                ) : (
                  <Package className="h-6 w-6 text-[#01034a]" />
                )}
                <span className="text-sm font-medium text-[#01034a]">
                  {syncProductsMutation.isPending ? "Sincronizando..." : "Sincronizar Produtos"}
                </span>
              </Button>

              <Button
                onClick={() => syncAllMutation.mutate()}
                disabled={isSyncing}
                className="h-20 rounded-2xl bg-[#fdd700] text-[#01034a] hover:bg-[#fdd700]/90 flex flex-col items-center gap-2 shadow-lg shadow-[#fdd700]/20 font-bold transition-all"
                data-testid="button-sync-all"
              >
                {syncAllMutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <RefreshCw className="h-6 w-6" />
                )}
                <span className="text-sm">
                  {syncAllMutation.isPending ? "Sincronizando tudo..." : "Sincronizar Tudo"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
