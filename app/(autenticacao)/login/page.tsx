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

export default function LoginPage() {
  const router = useRouter()

  //Limpa o cookie assim que o usuário entra na tela de login
  useEffect(() => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const entrarNoSistema = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Cookie de sessão (expira ao fechar o navegador)
    document.cookie = "auth-token=true; path=/; SameSite=Lax";

    router.push("/pacientes");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Login</CardTitle>
            <Link href="#" className="text-sm underline">
              Sign Up
            </Link>
          </div>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={entrarNoSistema} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => entrarNoSistema()}
              type="button"
            >
              Login with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}