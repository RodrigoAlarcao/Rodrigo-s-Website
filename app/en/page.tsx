import dynamic from "next/dynamic";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import AboutStatement from "@/components/sections/AboutStatement";
import { enContent } from "@/lib/content";

// Below-fold sections: lazily loaded JS bundles (HTML still server-rendered)
const WhatIDo = dynamic(() => import("@/components/sections/WhatIDo"), { ssr: true });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: true });
const Methodology = dynamic(() => import("@/components/sections/Methodology"), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: true });
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: true });

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
