"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Footprints, 
  LayoutDashboard, 
  Settings, 
  User, 
  History,
  Lock 
} from "lucide-react";

import { usePaciente } from "@/app/PacienteContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Pacientes", url: "/pacientes", icon: User, protected: false },  
  { title: "Visualização 3D", url: "/visualizacao", icon: LayoutDashboard, protected: true },
  { title: "Nova Análise", url: "/nova-analise", icon: Footprints, protected: true },
  { title: "Relatórios", url: "/historico", icon: History, protected: true },
  { title: "Configurações", url: "/configuracoes", icon: Settings, protected: false },
];

export function AppSidebar() {
  const { pacienteAtivo } = usePaciente();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-emerald-600 flex items-center justify-center">
            <div className="size-2 bg-white rounded-full" />
          </div>
          <span className="font-bold text-emerald-700 truncate tracking-tight uppercase">
            Gait Analyzer
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-[10px] uppercase tracking-widest">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isLocked = item.protected && !pacienteAtivo;

                return (
                  <SidebarMenuItem key={item.title}>
                    {isLocked ? (
                      /* 
                         SidebarMenuButton sem o 'asChild' e com 'disabled' 
                         para manter o alinhamento idêntico aos outros itens.
                      */
                      <SidebarMenuButton 
                        disabled
                        className="flex items-center gap-3 opacity-80 cursor-not-allowed select-none hover:bg-transparent"
                      >
                        {/* min-w-5 garante que o ícone ocupe o mesmo espaço sempre */}
                        <item.icon className="size-5 text-slate-500 min-w-5" />
                        <span className="font-medium text-slate-600 flex-1">{item.title}</span>
                        <Lock className="size-3.5 text-slate-800 stroke-[2.5px] ml-auto" />
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        className="hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="size-5 text-emerald-600 min-w-5" />
                          <span className="font-medium text-slate-700">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">
            Sistema Online - 2026
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}