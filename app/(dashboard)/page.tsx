"use client";

import Scene from "./components/Scene";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-10 space-y-6">
      <h1>Teste 3D</h1>
      <Button>Clique aqui</Button>
      <Scene />
    </div>
  );
}