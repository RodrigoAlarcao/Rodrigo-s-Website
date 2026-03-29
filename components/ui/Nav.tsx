"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMagnetic } from "@/hooks/useMagnetic";
import type { NavContent } from "@/lib/content";

export default function Nav({ content }: { content: NavContent }) {
  const CTA_TEXT = content.cta;
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaLettersRef = useRef<HTMLSpanElement>(null);
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

  const handleCtaEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = ctaLettersRef.current?.querySelectorAll("span");
    if (!letters || letters.length === 0) return;
    gsap.fromTo(
      letters,
      { y: 0 },
      {
        y: -4,
        stagger: 0.025,
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          gsap.to(letters, {
            y: 0,
            stagger: 0.02,
            duration: 0.4,
            ease: "elastic.out(1, 0.45)",
          });
        },
      }
    );
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-lg bg-black/70 ${
        scrolled
          ? "border-b border-white/10 shadow-[0_1px_24px_rgba(0,0,0,0.6)]"
          : "border-b border-white/5"
      }`}
    >
      <div className="container-site flex items-center justify-between py-6 md:py-8">
        {/* Logo */}
        <a
          href={content.logoHref}
          className="font-display font-bold text-text text-[1.125rem] tracking-tight hover:text-accent transition-colors duration-300"
        >
          RA
        </a>

        {/* CTA âncora — magnetic */}
        <a
          ref={ctaRef}
          href={content.ctaHref}
          onMouseEnter={handleCtaEnter}
          className="font-mono text-label uppercase tracking-[0.12em] text-accent border border-accent/40 px-4 py-1.5 rounded-full hover:bg-accent/10 hover:border-accent transition-all duration-300"
        >
          <span ref={ctaLettersRef} className="inline-flex">
            {CTA_TEXT.split("").map((char, i) => (
              <span key={i} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </a>
      </div>
    </header>
  );
}
