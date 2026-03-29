"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger, SplitText);

const A = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: "var(--color-accent)" }}>{children}</span>
);

export default function AboutStatement() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // prefers-reduced-motion — show all words at full opacity, no animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: "words" });
      const words = split.words;

      // Initial dim state for every word
      gsap.set(words, { opacity: 0.15 });

      // Scrubbed reveal as section scrolls into view
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      // Revert SplitText DOM changes on cleanup
      return () => split.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section>
      <div className="container-site py-32 md:py-40">
        <p
          ref={textRef}
          className="font-display font-bold leading-[1.35] max-w-[860px]"
          style={{
            fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
            color: "var(--color-text)",
          }}
        >
          Sou designer há <A>7 anos</A> e builder desde que percebi que ter a
          ideia e saber como fica não chegava. Aprendi a usar{" "}
          <A>inteligência artificial</A> como extensão do processo: para pensar
          com mais clareza, estruturar com mais rigor e executar sem perder
          qualidade. Criei uma forma de trabalhar que me permite ir de conceito
          a <A>produto real em semanas</A>. O que me distingue{" "}
          <A>não é a velocidade</A>. É a combinação de saber o que construir,
          como vai parecer, e ser capaz de o fazer.
        </p>
      </div>
    </section>
  );
}
