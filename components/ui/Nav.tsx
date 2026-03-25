"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50">
      <div className="container-site flex items-center justify-between py-6 md:py-8">
        {/* Logo */}
        <a
          href="/"
          className="font-display font-bold text-text text-[1.125rem] tracking-tight hover:text-accent transition-colors duration-300"
        >
          RA
        </a>

        {/* CTA âncora */}
        <a
          href="#contacto"
          className="font-mono text-label uppercase tracking-[0.12em] text-dim hover:text-accent transition-colors duration-300"
        >
          Fala comigo
        </a>
      </div>
    </header>
  );
}
