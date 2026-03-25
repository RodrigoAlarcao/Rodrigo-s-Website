import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import WhatIDo from "@/components/sections/WhatIDo";
import Projects from "@/components/sections/Projects";
import Methodology from "@/components/sections/Methodology";

// rodrigoalarcao.pt — Página principal
// Secções a construir:
// ✓ Nav
// ✓ Hero
// ✓ O que faço
// ✓ Projetos
// ✓ Como trabalho (Metodologia)
// — Contacto
// — Footer

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <WhatIDo />
      <Projects />
      <Methodology />
    </main>
  );
}
