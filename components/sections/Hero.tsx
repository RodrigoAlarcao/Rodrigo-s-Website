"use client";

import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export default function Hero() {
  // ── Layer 3: text refs (unchanged) ──────────────────────────────────────────
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // ── Layer 2: canvas refs ─────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tgtPos = useRef({ x: -9999, y: -9999 });
  const curPos = useRef({ x: -9999, y: -9999 });
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  // ── Canvas setup ─────────────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current!;
    const container = containerRef.current!;

    // Keep canvas pixel dimensions in sync with container
    const ro = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    });
    ro.observe(container);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // 8 Voronoi seeds — sunflower distribution (deterministic, larger cells)
    const N = 8;
    const phi = (1 + Math.sqrt(5)) / 2;
    const seeds = Array.from({ length: N }, (_, i) => {
      const r = Math.sqrt((i + 0.5) / N);
      const theta = (2 * Math.PI * i) / phi;
      return {
        bx: 0.5 + r * 0.42 * Math.cos(theta),
        by: 0.5 + r * 0.42 * Math.sin(theta),
        fx: 0.28 + (i % 5) * 0.06,  // rad/s — ciclo ~15-22s
        fy: 0.22 + (i % 7) * 0.04,  // rad/s — ciclo ~18-28s
        px: (i * 1.7) % (2 * Math.PI),
        py: (i * 2.3) % (2 * Math.PI),
      };
    });

    // Draw callback — registered on GSAP ticker
    const draw = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const ctx2d = canvas.getContext("2d")!;
      const SCALE = 4; // 1/4 resolution — better quality for thin lines
      const ow = Math.ceil(W / SCALE);
      const oh = Math.ceil(H / SCALE);

      // ── Voronoi on offscreen canvas (1/4 resolution) ──────────────────────
      if (!offscreenRef.current) {
        offscreenRef.current = document.createElement("canvas");
      }
      const off = offscreenRef.current;
      off.width = ow;
      off.height = oh;
      const octx = off.getContext("2d")!;
      const imgData = octx.createImageData(ow, oh);
      const data = imgData.data;

      // Animate seed positions — time already in seconds from GSAP ticker
      const t = time;
      const sPos = seeds.map((s) => ({
        x: (s.bx + 0.04 * Math.cos(t * s.fx + s.px)) * ow,
        y: (s.by + 0.04 * Math.sin(t * s.fy + s.py)) * oh,
      }));

      // Per-pixel Voronoi: distance to cell boundary for thin-line rendering
      // distToBoundary ≈ (dist2nd - distNearest) / 2 — pixels to the nearest edge
      const LINE_HALF = 0.55; // offscreen pixels → ~2px at full res after 4× upscale
      for (let py = 0; py < oh; py++) {
        for (let px = 0; px < ow; px++) {
          let d1 = Infinity;
          let d2 = Infinity;
          for (const s of sPos) {
            const dx = px - s.x;
            const dy = py - s.y;
            const d = dx * dx + dy * dy;
            if (d < d1) {
              d2 = d1;
              d1 = d;
            } else if (d < d2) {
              d2 = d;
            }
          }
          const distToBoundary = (Math.sqrt(d2) - Math.sqrt(d1)) * 0.5;
          const idx = (py * ow + px) * 4;
          if (distToBoundary < LINE_HALF) {
            // White at 60% max opacity, fades to 0 at line edge
            const alpha = (1 - distToBoundary / LINE_HALF) * 153;
            data[idx] = 255;
            data[idx + 1] = 255;
            data[idx + 2] = 255;
            data[idx + 3] = alpha;
          } else {
            data[idx + 3] = 0;
          }
        }
      }
      octx.putImageData(imgData, 0, 0);

      // ── Main canvas compositing ───────────────────────────────────────────
      ctx2d.clearRect(0, 0, W, H);

      // Step 1: Solid black mask — hides the CSS image layer below
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.fillStyle = "#0A0A09";
      ctx2d.fillRect(0, 0, W, H);

      // Step 2: Lerp cursor toward target
      const lerpFactor = 0.072;
      curPos.current.x += (tgtPos.current.x - curPos.current.x) * lerpFactor;
      curPos.current.y += (tgtPos.current.y - curPos.current.y) * lerpFactor;

      // Step 3: destination-out reveal — erases black where cursor is
      if (tgtPos.current.x > -1000) {
        const cx = curPos.current.x;
        const cy = curPos.current.y;
        const grad = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, 300);
        grad.addColorStop(0, "rgba(0,0,0,1.0)");
        grad.addColorStop(0.45, "rgba(0,0,0,0.97)");
        grad.addColorStop(0.75, "rgba(0,0,0,0.5)");
        grad.addColorStop(1, "rgba(0,0,0,0.0)");
        ctx2d.globalCompositeOperation = "destination-out";
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, W, H);
      }

      // Step 4: Voronoi — thin white lines, minimal blur to smooth 4× upscale
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.imageSmoothingEnabled = true;
      ctx2d.imageSmoothingQuality = "high";
      ctx2d.filter = "blur(1.5px)";
      ctx2d.drawImage(off, 0, 0, W, H);
      ctx2d.filter = "none";
    };

    gsap.ticker.add(draw);

    return () => {
      gsap.ticker.remove(draw);
      ro.disconnect();
    };
  }, []);

  // ── Mouse handlers ────────────────────────────────────────────────────────────
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    tgtPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseLeave = () => {
    tgtPos.current = { x: -9999, y: -9999 };
  };

  // ── GSAP entrance timeline (unchanged) ───────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Estado final imediato — sem animação
        gsap.set(
          [
            nameRef.current,
            dividerRef.current,
            taglineRef.current,
            ctaRef.current,
          ],
          { clearProps: "all" }
        );
        return;
      }

      // Timeline de entrada — PRD secção 5.1
      const tl = gsap.timeline({ delay: 0.2 });

      // Nome: clipPath reveal da esquerda para a direita
      tl.from(nameRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.0,
        ease: "power3.inOut",
      })
        // Separador: scale da esquerda
        .from(
          dividerRef.current,
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.2"
        )
        // Tagline: sobe com fade
        .from(
          taglineRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        // CTA: sobe suavemente
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden min-h-screen flex flex-col justify-between pt-32 md:pt-40 pb-16 md:pb-24"
    >
      {/* Layer 1 — background image (CSS, position absolute) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.72) saturate(0.85) sepia(0.08)",
        }}
      />

      {/* Layer 2 — canvas: Voronoi + reveal mask */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none w-full h-full"
      />

      {/* Layer 3 — text content (unchanged JSX) */}
      <div className="w-full container-site relative z-20 flex flex-col gap-16 md:gap-0 md:justify-between md:h-full md:flex-1">

        {/* Nome — sempre duas linhas, oversized, editorial */}
        <h1
          ref={nameRef}
          className="font-display font-extrabold text-hero-name text-text leading-[0.92] tracking-tight"
        >
          Rodrigo
          <br />
          Alarcão
        </h1>

        {/* Separador em accent + rodapé do hero */}
        <div className="mt-10 md:mt-14">
          {/* 1px accent divider — PRD secção 2.4 */}
          <div
            ref={dividerRef}
            className="w-full border-t border-accent mb-10 md:mb-14"
          />

          {/* Tagline + CTA — editorial: texto à esquerda, CTA à direita */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
            <p
              ref={taglineRef}
              className="text-hero-tagline font-body font-light text-text max-w-[560px] leading-[1.4]"
            >
              Projeto, estruturo e construo produtos digitais —
              <br className="hidden sm:block" />
              da ideia ao MVP, em semanas.
            </p>

            {/* CTA — confiante, sem implorar atenção */}
            <a
              ref={ctaRef}
              href="#contacto"
              className="font-display font-medium text-[1.125rem] text-text hover:text-accent transition-colors duration-300 whitespace-nowrap group flex items-center gap-2"
            >
              Fala comigo
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
