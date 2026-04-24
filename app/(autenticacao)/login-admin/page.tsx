"use client";

import { useEffect } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()

  // Limpa os cookies ao entrar para garantir uma sessão limpa
  useEffect(() => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const entrarComoAdmin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    //  Define o token de autenticação
    document.cookie = "auth-token=true; path=/; SameSite=Lax";
    
    //  Define o cargo de admin (Essencial para o Proxy e para a Sidebar)
    document.cookie = "user-role=admin; path=/; SameSite=Lax";

    // Redireciona para a área administrativa
    router.push("/admin/profissionais");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm border-emerald-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-800">Admin Login</CardTitle>
          <CardDescription>
            Acesse o painel administrativo para gerenciar profissionais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={entrarComoAdmin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Administrativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gaitanalyzer.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Entrar no Painel
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => router.push("/login")}
              type="button"
            >
              Voltar para Login Profissional
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}