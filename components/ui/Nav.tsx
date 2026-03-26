"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Frosted glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance animation
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

  // Magnetic CTA
  useMagnetic(ctaRef, 0.4);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-bg/80 backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="container-site flex items-center justify-between py-6 md:py-8">
        {/* Logo */}
        <a
          href="/"
          className="font-display font-bold text-text text-[1.125rem] tracking-tight hover:text-accent transition-colors duration-300"
        >
          RA
        </a>

        {/* CTA âncora — magnetic */}
        <a
          ref={ctaRef}
          href="#contacto"
          className="font-mono text-label uppercase tracking-[0.12em] text-dim hover:text-accent transition-colors duration-300"
        >
          Fala comigo
        </a>
      </div>
    </header>
  );
}
