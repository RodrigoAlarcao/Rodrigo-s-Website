"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Integração obrigatória Lenis + ScrollTrigger (FOUNDATION secção 2.2)
// lenis.on('scroll', ScrollTrigger.update) — sincroniza posições
// gsap.ticker substitui o requestAnimationFrame loop do Lenis
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respeitar prefers-reduced-motion — sem smooth scroll
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sincronizar Lenis com ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker substitui o rAF loop do Lenis — sincronização perfeita
    // Store the function reference so cleanup can remove the exact same listener
    const lenisRaf = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(lenisRaf);
    };
  }, []);

  return <>{children}</>;
}
