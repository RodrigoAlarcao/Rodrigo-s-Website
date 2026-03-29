import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import AboutStatement from "@/components/sections/AboutStatement";
import WhatIDo from "@/components/sections/WhatIDo";
import Projects from "@/components/sections/Projects";
import Methodology from "@/components/sections/Methodology";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { ptContent } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <Nav content={ptContent.nav} />
      <Hero content={ptContent.hero} />
      <AboutStatement content={ptContent.about} />
      <WhatIDo content={ptContent.whatIDo} />
      <Projects content={ptContent.projects} />
      <Methodology content={ptContent.methodology} />
      <Contact content={ptContent.contact} />
      <Footer />
    </main>
  );
}
