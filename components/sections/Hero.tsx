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

    // Asymmetric 3-blob layout — one dominant + medium + small
    // r is fraction of viewport height; cx/cy normalised to W/H
    const blobDefs: Array<{
      cx: number; cy: number; r: number; n: number; rings: number;
    }> = [
      { cx: 0.78, cy: 0.42, r: 0.38, n: 16, rings: 7 }, // large — right, dominant
      { cx: 0.10, cy: 0.30, r: 0.21, n: 13, rings: 5 }, // medium — upper left
      { cx: 0.38, cy: 0.80, r: 0.12, n: 10, rings: 3 }, // small — lower centre
    ];

    // Per-blob concentric ring scales so inner rings NEVER cross outer.
    // With ar=0.05: need Δ > 2*s*0.05/1.05 ≈ 0.095*s.
    // Uniform step Δ=0.14 satisfies this at all scales (0.14 > 0.095).
    // Alphas fade from 0.26 (outer) toward 0 (innermost).
    const makeRings = (count: number) =>
      Array.from({ length: count }, (_, ri) => ({
        scale: 1.0 - ri * 0.14,
        alpha: 0.26 * Math.pow(1 - ri / count, 0.7),
      }));

    // Per-point animation params — gentler harmonics for smoother silhouette
    const blobs = blobDefs.map((def, bi) =>
      Array.from({ length: def.n }, (_, i) => ({
        baseAngle: (2 * Math.PI * i) / def.n + bi * 0.61,
        // Two low-frequency harmonics only → rounder, smoother blob shape
        baseR:
          1.0 +
          0.10 * Math.sin(i * 1.8 + bi * 1.7) +
          0.05 * Math.sin(i * 3.1 + bi * 0.9),
        fr:  0.22 + bi * 0.06 + i * 0.010, // radial oscillation freq (rad/s)
        fa:  0.15 + bi * 0.04 + i * 0.007, // angular oscillation freq (rad/s)
        pr:  (bi * 1.3 + i * 0.9) % (2 * Math.PI),
        pa:  (bi * 0.7 + i * 1.4) % (2 * Math.PI),
        ar:  0.05, // radial amplitude — small to keep rings non-crossing
        aa:  0.04, // angular amplitude (radians) — subtle, keeps curves smooth
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

    // Mouse attraction — outer ring pulled toward cursor; inner rings follow
    const ATTRACT_RADIUS = 240;
    const ATTRACT_STRENGTH = 45;

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

      // Step 4: Concentric rings per blob
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.lineWidth = 1;
      ctx2d.lineCap = "round";
      ctx2d.lineJoin = "round";

      const t = time;
      const mx = curPos.current.x;
      const my = curPos.current.y;

      blobDefs.forEach((def, bi) => {
        const bcx = def.cx * W;
        const bcy = def.cy * H;

        // Compute outer ring points (with mouse attraction)
        const outerPts = blobs[bi].map((p) => {
          const angle = p.baseAngle + p.aa * Math.sin(t * p.fa + p.pa);
          const rad   = def.r * H * p.baseR * (1 + p.ar * Math.sin(t * p.fr + p.pr));
          let x = bcx + Math.cos(angle) * rad;
          let y = bcy + Math.sin(angle) * rad;

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

        // Draw each ring — inner rings are outer pts scaled toward blob centre
        const rings = makeRings(def.rings);
        rings.forEach((ring, ri) => {
          const pts =
            ri === 0
              ? outerPts
              : outerPts.map((op) => ({
                  x: bcx + (op.x - bcx) * ring.scale,
                  y: bcy + (op.y - bcy) * ring.scale,
                }));

          ctx2d.strokeStyle = `rgba(255,255,255,${ring.alpha.toFixed(3)})`;
          drawClosed(ctx2d, pts);
        });
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
