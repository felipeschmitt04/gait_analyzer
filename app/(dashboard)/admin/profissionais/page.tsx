"use client"

import { useState } from "react"
import { Plus, X, User, Search, Briefcase, IdCard, Edit3, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  registro: string;
  unidade: string;
  observacoes: string;
}

export default function ProfissionaisPage() {
  const [showModalCadastro, setShowModalCadastro] = useState(false)
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null)
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [busca, setBusca] = useState("")

  // --- LÓGICA DE ORDENAÇÃO E PAGINAÇÃO ---
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 12

  const filtrados = profissionais.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const ordenados = [...filtrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  )

  const totalPaginas = Math.ceil(ordenados.length / itensPorPagina)
  const exibidos = ordenados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)

  const handleSaveNovo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const novo: Profissional = {
      id: Date.now(),
      nome: formData.get("nome") as string,
      especialidade: formData.get("especialidade") as string,
      registro: formData.get("registro") as string,
      unidade: formData.get("unidade") as string,
      observacoes: formData.get("observacoes") as string,
    }
    setProfissionais([novo, ...profissionais])
    setShowModalCadastro(false)
  }

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      
      {/* CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Profissionais</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Gerencie o acesso dos profissionais de saúde.</p>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              placeholder="Buscar profissional..." 
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
              style={{ height: '48px', width: '100%', paddingLeft: '44px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
        </div>

        <Button onClick={() => setShowModalCadastro(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg h-12 font-semibold">
          <Plus className="size-5 mr-2" /> Novo Profissional
        </Button>
      </div>

      {/* LISTA DE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {exibidos.map((p) => (
          <div 
            key={p.id} 
            onClick={() => setProfissionalSelecionado(p)}
            className="hover:border-emerald-200 hover:shadow-md active:scale-95 bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="bg-slate-100 min-w-[50px] h-[50px] rounded-xl flex items-center justify-center">
              <User size={22} className="text-slate-600" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-800 m-0 text-[15px] truncate">{p.nome}</h3>
              <div className="flex gap-3 mt-1 text-[12px] text-slate-400">
                <span className="flex items-center gap-1"><Briefcase size={12} /> {p.especialidade}</span>
                <span className="flex items-center gap-1"><IdCard size={12} /> {p.registro}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINAÇÃO DINÂMICA */}
      {totalPaginas > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1); }}
                  className={paginaAtual === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPaginas }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={paginaAtual === i + 1}
                    onClick={(e) => { e.preventDefault(); setPaginaAtual(i + 1); }}
                    className={paginaAtual === i + 1 ? "bg-slate-900 text-white" : ""}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1); }}
                  className={paginaAtual === totalPaginas ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* MODAL DE CADASTRO PROFISSIONAL */}
      {showModalCadastro && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px' }}>
          <div onClick={() => setShowModalCadastro(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'relative', backgroundColor: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button onClick={() => setShowModalCadastro(false)} style={{ position: 'absolute', top: '20px', right: '20px', color: '#94a3b8' }}><X size={20} /></button>
            <form onSubmit={handleSaveNovo}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend style={{ fontSize: '18px', fontWeight: 'bold' }}>Cadastrar Profissional</FieldLegend>
                  <FieldGroup style={{ marginTop: '16px' }}>
                    <Field><FieldLabel>Nome Completo</FieldLabel><Input name="nome" required className="h-10" /></Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                      <Field><FieldLabel>Especialidade</FieldLabel><Input name="especialidade" required className="h-10" placeholder="Ex: Fisioterapeuta" /></Field>
                      <Field><FieldLabel>Registro (CRM/CRP)</FieldLabel><Input name="registro" required className="h-10" /></Field>
                    </div>
                    <Field style={{ marginTop: '12px' }}><FieldLabel>Unidade / Clínica</FieldLabel><Input name="unidade" className="h-10" /></Field>
                    <Field style={{ marginTop: '12px' }}><FieldLabel>Observações</FieldLabel><Textarea name="observacoes" style={{ minHeight: '80px' }} /></Field>
                  </FieldGroup>
                </FieldSet>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <Button type="submit" className="bg-emerald-600 flex-1 h-12 rounded-xl font-bold text-white">Salvar Profissional</Button>
                  <Button variant="outline" type="button" onClick={() => setShowModalCadastro(false)} className="flex-1 h-12 rounded-xl">Cancelar</Button>
                </div>
              </FieldGroup>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}