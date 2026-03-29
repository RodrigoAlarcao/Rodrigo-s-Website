import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import AboutStatement from "@/components/sections/AboutStatement";
import WhatIDo from "@/components/sections/WhatIDo";
import Projects from "@/components/sections/Projects";
import Methodology from "@/components/sections/Methodology";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <AboutStatement />
      <WhatIDo />
      <Projects />
      <Methodology />
      <Contact />
      <Footer />
    </main>
  );
}
