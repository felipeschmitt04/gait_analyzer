"use client";
import { Canvas } from "@react-three/fiber";

// PRECISA TER O "default"
export default function Scene() { 
  return (
    <Canvas style={{ height: "300px" }}>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}