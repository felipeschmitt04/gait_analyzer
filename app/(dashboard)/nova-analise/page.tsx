"use client";

import { ProtecaoPaciente } from "@/components/ProtecaoPaciente";
import { usePaciente } from "@/app/PacienteContext";

export default function NovaAnalisePage() {
  const { pacienteAtivo } = usePaciente();

  return (
    <ProtecaoPaciente>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4 text-slate-800 uppercase tracking-tight">
          Nova Análise
        </h1>
        
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg mb-6">
          <p className="text-emerald-800">
            Realizando análise para: <strong>{pacienteAtivo}</strong>
          </p>
        </div>

        <div className="w-full h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
          <p className="text-slate-400 italic">Interface de captura de dados e sensores.</p>
        </div>
      </div>
    </ProtecaoPaciente>
  );
}