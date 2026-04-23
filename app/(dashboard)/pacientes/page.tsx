"use client"

import { useState } from "react"
import { Plus, X, User, Search, Calendar, Weight, Edit3, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePaciente } from "@/app/PacienteContext";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

interface Paciente {
  id: number;
  nome: string;
  nascimento: string;
  genero: string;
  peso: string;
  observacoes: string;
}

export default function PacientesPage() {
  const [showModalCadastro, setShowModalCadastro] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  
  // Acessa a função de definir o paciente globalmente
  const { setPacienteAtivo } = usePaciente()

  // Criar novo paciente
  const handleSaveNovo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const novo: Paciente = {
      id: Date.now(),
      nome: formData.get("nome") as string,
      nascimento: formData.get("nascimento") as string,
      genero: formData.get("genero") as string,
      peso: formData.get("peso") as string,
      observacoes: formData.get("observacoes") as string,
    }
    setPacientes([novo, ...pacientes])
    setShowModalCadastro(false)
  }

  // Atualizar paciente existente
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pacienteSelecionado) return
    const formData = new FormData(e.currentTarget)
    const listaAtualizada = pacientes.map(p => {
      if (p.id === pacienteSelecionado.id) {
        return {
          ...p,
          nome: formData.get("nome") as string,
          nascimento: formData.get("nascimento") as string,
          genero: formData.get("genero") as string,
          peso: formData.get("peso") as string,
          observacoes: formData.get("observacoes") as string,
        }
      }
      return p
    })
    setPacientes(listaAtualizada)
    setPacienteSelecionado(null)
  }

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      
      {/* CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', gap: '12px' }}>
        <div style={{ flex: '0 0 auto' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a', margin: 0, lineHeight: '1.2' }}>Pacientes</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Gerencie o prontuário dos seus pacientes.</p>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 10 }} />
            <input placeholder="Buscar por nome..." style={{ height: '48px', width: '100%', paddingLeft: '44px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }} />
          </div>
        </div>

        <Button onClick={() => setShowModalCadastro(true)} style={{ height: '48px', paddingLeft: '24px', paddingRight: '24px' }} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition-all active:scale-95 font-semibold">
          <Plus className="size-5 mr-2" /> Novo Paciente
        </Button>
      </div>

      {/* LISTA DE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {pacientes.map((p) => (
          <div 
            key={p.id} 
            onClick={() => setPacienteSelecionado(p)}
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', cursor: 'pointer' }} 
            className="hover:border-emerald-200 hover:shadow-md active:scale-95"
          >
            <div style={{ backgroundColor: '#f0fdf4', minWidth: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={22} className="text-emerald-600" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ fontWeight: 'bold', color: '#1e293b', margin: 0, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nome}</h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {p.nascimento.split('-').reverse().join('/')}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><Weight size={12} /> {p.peso}kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CADASTRO */}
      {showModalCadastro && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px' }}>
          <div onClick={() => setShowModalCadastro(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'relative', backgroundColor: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button onClick={() => setShowModalCadastro(false)} style={{ position: 'absolute', top: '20px', right: '20px', color: '#94a3b8' }}><X size={20} /></button>
            <form onSubmit={handleSaveNovo}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend style={{ fontSize: '18px', fontWeight: 'bold' }}>Cadastrar Paciente</FieldLegend>
                  <FieldGroup style={{ marginTop: '16px' }}>
                    <Field><FieldLabel>Nome</FieldLabel><Input name="nome" required className="h-10" /></Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                      <Field><FieldLabel>Nascimento</FieldLabel><Input name="nascimento" type="date" required className="h-10" /></Field>
                      <Field>
                        <FieldLabel>Gênero</FieldLabel>
                        <select name="genero" defaultValue="" required className="h-10 w-full border rounded-lg px-2 bg-white">
                          <option value="" disabled>Selecionar</option>
                          <option value="m">Masculino</option>
                          <option value="f">Feminino</option>
                          <option value="o">Outro</option>
                        </select>
                      </Field>
                    </div>
                    <Field style={{ marginTop: '12px' }}><FieldLabel>Peso (kg)</FieldLabel><Input name="peso" type="number" className="h-10" /></Field>
                    <Field style={{ marginTop: '12px' }}><FieldLabel>Observações</FieldLabel><Textarea name="observacoes" style={{ minHeight: '80px' }} /></Field>
                  </FieldGroup>
                </FieldSet>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <Button type="submit" className="bg-emerald-600 flex-1 h-12 rounded-xl font-bold">Salvar Registro</Button>
                  <Button variant="outline" type="button" onClick={() => setShowModalCadastro(false)} className="flex-1 h-12 rounded-xl">Cancelar</Button>
                </div>
              </FieldGroup>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ALTERAR/SELECIONAR */}
      {pacienteSelecionado && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px' }}>
          <div onClick={() => setPacienteSelecionado(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'relative', backgroundColor: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button onClick={() => setPacienteSelecionado(null)} style={{ position: 'absolute', top: '20px', right: '20px', color: '#94a3b8' }}><X size={20} /></button>
            <form onSubmit={handleUpdate}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend style={{ fontSize: '18px', fontWeight: 'bold' }}>Dados do Paciente</FieldLegend>
                  <FieldDescription>Edite as informações ou selecione o prontuário.</FieldDescription>
                  <FieldGroup style={{ marginTop: '16px' }}>
                    <Field><FieldLabel>Nome</FieldLabel><Input name="nome" defaultValue={pacienteSelecionado.nome} className="h-10" /></Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                      <Field><FieldLabel>Nascimento</FieldLabel><Input name="nascimento" type="date" defaultValue={pacienteSelecionado.nascimento} className="h-10" /></Field>
                      <Field>
                        <FieldLabel>Gênero</FieldLabel>
                        <select name="genero" defaultValue={pacienteSelecionado.genero} className="h-10 w-full border rounded-lg px-2 bg-white">
                          <option value="m">Masculino</option>
                          <option value="f">Feminino</option>
                          <option value="o">Outro</option>
                        </select>
                      </Field>
                    </div>
                    <Field style={{ marginTop: '12px' }}><FieldLabel>Peso (kg)</FieldLabel><Input name="peso" type="number" defaultValue={pacienteSelecionado.peso} className="h-10" /></Field>
                    <Field style={{ marginTop: '12px' }}><FieldLabel>Observações</FieldLabel><Textarea name="observacoes" defaultValue={pacienteSelecionado.observacoes} style={{ minHeight: '80px' }} /></Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator style={{ margin: '20px 0' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button type="submit" variant="outline" className="flex-1 h-12 rounded-xl text-slate-600 border-slate-200 gap-2 font-semibold active:scale-95 transition-all">
                    <Edit3 size={18} /> Alterar
                  </Button>
                  
                  {/* Botão Selecionar atualizado para usar o Contexto Global */}
                  <Button 
                    type="button" 
                    onClick={() => {
                        setPacienteAtivo(pacienteSelecionado.nome); // Atualiza na "nuvem"
                        setPacienteSelecionado(null); // Fecha o modal
                    }} 
                    className="bg-emerald-600 flex-1 h-12 rounded-xl font-bold gap-2 active:scale-95 transition-all"
                  >
                    <CheckCircle size={18} /> Selecionar
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}