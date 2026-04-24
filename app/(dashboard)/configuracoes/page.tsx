"use client";

import { LogOut, User, Settings, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ConfiguracoesPage() {
  
  // Função de Logout para limpar ambos os cookies
  const handleLogout = () => {
    // Mata o token de autenticação
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    // Mata o cargo de admin
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    //Limpa dados de sessão do LocalStorage se existirem
    localStorage.removeItem("paciente_selecionado");

    //Redireciona para o login com refresh total
    window.location.href = "/login";
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>Suas informações básicas de acesso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Email de Acesso</p>
                <p className="text-sm text-slate-500">usuario@exemplo.com</p>
              </div>
              <Button variant="outline" size="sm">Alterar</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Segurança e Sessão
            </CardTitle>
            <CardDescription>Controle o acesso à sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Senha</p>
                <p className="text-sm text-slate-500">Última alteração há 3 meses.</p>
              </div>
              <Button variant="outline" size="sm">Atualizar Senha</Button>
            </div>

            <Separator />

            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-red-900">Encerrar Sessão</p>
                <p className="text-sm text-red-700">
                  Isso removerá seu acesso imediato e exigirá login novamente.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 gap-2 shadow-sm transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                Sair do Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
          Gait Analyzer v1.0.0
        </p>
      </div>
    </div>
  );
}