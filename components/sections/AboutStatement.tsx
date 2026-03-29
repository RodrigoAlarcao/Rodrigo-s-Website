"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import type { AboutSegment } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, SplitText);

const A = ({ children }: { children: React.ReactNode }) => (
  <span className="font-normal italic" style={{ color: "var(--color-accent)" }}>{children}</span>
);

export default function AboutStatement({ content }: { content: AboutSegment[] }) {
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
          className="font-display font-bold leading-[1.15] w-full"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)",
            color: "var(--color-text)",
          }}
        >
          {content.map((seg, i) =>
            seg.accent
              ? <React.Fragment key={i}><A>{seg.text}</A></React.Fragment>
              : <span key={i}>{seg.text}</span>
          )}
        </p>
      </div>
    </section>
  );
}
