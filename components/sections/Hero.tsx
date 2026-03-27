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

    // 5 organic flowing curves — each has 5 control points
    // bx/by: base normalised position (0–1); ay: y-amplitude; fy: frequency rad/s; py: phase
    const curves: Array<Array<{ bx: number; by: number; ay: number; fy: number; py: number }>> = [
      [
        { bx: 0.00, by: 0.12, ay: 0.05, fy: 0.20, py: 0.0  },
        { bx: 0.28, by: 0.06, ay: 0.07, fy: 0.17, py: 1.4  },
        { bx: 0.52, by: 0.18, ay: 0.06, fy: 0.22, py: 2.8  },
        { bx: 0.76, by: 0.10, ay: 0.05, fy: 0.18, py: 0.9  },
        { bx: 1.00, by: 0.15, ay: 0.07, fy: 0.15, py: 3.5  },
      ],
      [
        { bx: 0.00, by: 0.32, ay: 0.06, fy: 0.18, py: 0.7  },
        { bx: 0.30, by: 0.42, ay: 0.08, fy: 0.23, py: 2.1  },
        { bx: 0.55, by: 0.28, ay: 0.07, fy: 0.16, py: 1.5  },
        { bx: 0.78, by: 0.44, ay: 0.06, fy: 0.21, py: 3.8  },
        { bx: 1.00, by: 0.35, ay: 0.08, fy: 0.19, py: 0.3  },
      ],
      [
        { bx: 0.00, by: 0.54, ay: 0.07, fy: 0.15, py: 2.0  },
        { bx: 0.25, by: 0.62, ay: 0.09, fy: 0.21, py: 0.5  },
        { bx: 0.50, by: 0.47, ay: 0.08, fy: 0.18, py: 3.1  },
        { bx: 0.75, by: 0.60, ay: 0.07, fy: 0.24, py: 1.8  },
        { bx: 1.00, by: 0.52, ay: 0.06, fy: 0.16, py: 4.2  },
      ],
      [
        { bx: 0.00, by: 0.74, ay: 0.06, fy: 0.22, py: 1.2  },
        { bx: 0.32, by: 0.66, ay: 0.08, fy: 0.16, py: 3.4  },
        { bx: 0.58, by: 0.80, ay: 0.07, fy: 0.20, py: 0.6  },
        { bx: 0.80, by: 0.70, ay: 0.09, fy: 0.17, py: 2.5  },
        { bx: 1.00, by: 0.76, ay: 0.06, fy: 0.23, py: 1.0  },
      ],
      [
        { bx: 0.00, by: 0.90, ay: 0.05, fy: 0.17, py: 3.0  },
        { bx: 0.35, by: 0.96, ay: 0.06, fy: 0.22, py: 0.8  },
        { bx: 0.60, by: 0.86, ay: 0.07, fy: 0.19, py: 2.3  },
        { bx: 0.82, by: 0.94, ay: 0.05, fy: 0.15, py: 4.0  },
        { bx: 1.00, by: 0.91, ay: 0.06, fy: 0.20, py: 1.6  },
      ],
    ];

    // Draw Catmull-Rom spline via cubic bezier approximation
    const drawSpline = (
      ctx: CanvasRenderingContext2D,
      pts: Array<{ x: number; y: number }>
    ) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        // Catmull-Rom → cubic bezier control points
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      ctx.stroke();
    };

    // Draw callback — registered on GSAP ticker
    const draw = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const ctx2d = canvas.getContext("2d")!;

      // ── Compositing ───────────────────────────────────────────────────────
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
        grad.addColorStop(0,    "rgba(0,0,0,1.0)");
        grad.addColorStop(0.45, "rgba(0,0,0,0.97)");
        grad.addColorStop(0.75, "rgba(0,0,0,0.5)");
        grad.addColorStop(1,    "rgba(0,0,0,0.0)");
        ctx2d.globalCompositeOperation = "destination-out";
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, W, H);
      }

      // Step 4: Organic splines — thin white lines over everything
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.strokeStyle = "rgba(255,255,255,0.28)";
      ctx2d.lineWidth = 1;
      ctx2d.lineCap = "round";
      ctx2d.lineJoin = "round";

      const t = time; // seconds, from GSAP ticker
      for (const curveDef of curves) {
        const pts = curveDef.map((p) => ({
          x: p.bx * W,
          y: (p.by + p.ay * Math.sin(t * p.fy + p.py)) * H,
        }));
        drawSpline(ctx2d, pts);
      }
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

      {/* Layer 2 — canvas: organic splines + cursor reveal mask */}
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
