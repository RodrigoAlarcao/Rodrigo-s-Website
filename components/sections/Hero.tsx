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

    const ro = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    });
    ro.observe(container);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // 5 closed organic blobs — cx/cy: centre (normalised); r: radius (fraction of H); n: points
    const blobDefs: Array<{ cx: number; cy: number; r: number; n: number }> = [
      { cx: 0.68, cy: 0.42, r: 0.28, n: 8 }, // main right blob
      { cx: 0.18, cy: 0.28, r: 0.22, n: 7 }, // upper-left
      { cx: 0.62, cy: 0.78, r: 0.30, n: 8 }, // lower-center-right
      { cx: 0.85, cy: 0.18, r: 0.16, n: 6 }, // small upper-right
      { cx: 0.28, cy: 0.74, r: 0.24, n: 7 }, // lower-left
    ];

    // Per-point animation params — all deterministic, no Math.random
    const blobs = blobDefs.map((def, bi) =>
      Array.from({ length: def.n }, (_, i) => ({
        baseAngle: (2 * Math.PI * i) / def.n + bi * 0.38,
        baseR:     1.0 + 0.28 * Math.sin(i * 2.3 + bi * 1.7), // ±28% radius jitter
        fr:        0.14 + bi * 0.03 + i * 0.015,  // radial osc. freq (rad/s)
        fa:        0.09 + bi * 0.025 + i * 0.011, // angular osc. freq (rad/s)
        pr:        (bi * 1.3 + i * 0.9) % (2 * Math.PI), // radial phase
        pa:        (bi * 0.7 + i * 1.4) % (2 * Math.PI), // angular phase
        ar:        0.09, // radial amplitude (fraction of blob radius)
        aa:        0.07, // angular amplitude (radians)
      }))
    );

    // Closed Catmull-Rom spline via cubic bezier (wraps end→start)
    const drawClosed = (
      ctx: CanvasRenderingContext2D,
      pts: Array<{ x: number; y: number }>
    ) => {
      const n = pts.length;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];
        ctx.bezierCurveTo(
          p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
          p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
          p2.x, p2.y
        );
      }
      ctx.stroke();
    };

    // Mouse attraction params — lines are pulled toward cursor
    const ATTRACT_RADIUS = 280;   // px — influence zone
    const ATTRACT_STRENGTH = 50;  // px — max displacement

    const draw = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const ctx2d = canvas.getContext("2d")!;
      ctx2d.clearRect(0, 0, W, H);

      // Step 1: Black mask
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.fillStyle = "#0A0A09";
      ctx2d.fillRect(0, 0, W, H);

      // Step 2: Lerp cursor
      const lerpFactor = 0.072;
      curPos.current.x += (tgtPos.current.x - curPos.current.x) * lerpFactor;
      curPos.current.y += (tgtPos.current.y - curPos.current.y) * lerpFactor;

      // Step 3: Cursor reveal (destination-out)
      const cursorActive = tgtPos.current.x > -1000;
      if (cursorActive) {
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

      // Step 4: Organic closed blobs with mouse attraction
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.strokeStyle = "rgba(255,255,255,0.28)";
      ctx2d.lineWidth = 1;
      ctx2d.lineCap = "round";
      ctx2d.lineJoin = "round";

      const t = time;
      const mx = curPos.current.x;
      const my = curPos.current.y;

      blobDefs.forEach((def, bi) => {
        const pts = blobs[bi].map((p) => {
          // Animated polar → cartesian
          const angle = p.baseAngle + p.aa * Math.sin(t * p.fa + p.pa);
          const rad   = def.r * H * p.baseR * (1 + p.ar * Math.sin(t * p.fr + p.pr));
          let x = def.cx * W + Math.cos(angle) * rad;
          let y = def.cy * H + Math.sin(angle) * rad;

          // Attract control points toward cursor
          if (cursorActive) {
            const dx = mx - x;
            const dy = my - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ATTRACT_RADIUS && dist > 0) {
              const force = ATTRACT_STRENGTH * Math.pow(1 - dist / ATTRACT_RADIUS, 2);
              x += (dx / dist) * force;
              y += (dy / dist) * force;
            }
          }
          return { x, y };
        });
        drawClosed(ctx2d, pts);
      });
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
