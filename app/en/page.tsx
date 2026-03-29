import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import AboutStatement from "@/components/sections/AboutStatement";
import WhatIDo from "@/components/sections/WhatIDo";
import Projects from "@/components/sections/Projects";
import Methodology from "@/components/sections/Methodology";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { enContent } from "@/lib/content";

export default function HomeEn() {
  return (
    <main>
      <Nav content={enContent.nav} />
      <Hero content={enContent.hero} />
      <AboutStatement content={enContent.about} />
      <WhatIDo content={enContent.whatIDo} />
      <Projects content={enContent.projects} />
      <Methodology content={enContent.methodology} />
      <Contact content={enContent.contact} />
      <Footer />
    </main>
  );
}
