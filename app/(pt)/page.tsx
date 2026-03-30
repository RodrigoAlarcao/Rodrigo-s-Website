import dynamic from "next/dynamic";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import AboutStatement from "@/components/sections/AboutStatement";
import { ptContent } from "@/lib/content";

// Below-fold sections: lazily loaded JS bundles (HTML still server-rendered)
const WhatIDo = dynamic(() => import("@/components/sections/WhatIDo"), { ssr: true });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: true });
const Methodology = dynamic(() => import("@/components/sections/Methodology"), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: true });
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: true });

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
