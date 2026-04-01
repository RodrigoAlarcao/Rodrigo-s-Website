"use client";

import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLoading } from "@/context/LoadingContext";
import type { HeroContent } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ content }: { content: HeroContent }) {
  const { isLoaded } = useLoading();

  // ── Layer 3: text refs (unchanged) ──────────────────────────────────────────
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // ── Parallax wrapper: both image layers move together ───────────────────────
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);

  // ── Layer 1: background image ref ───────────────────────────────────────────
  const bgImageRef = useRef<HTMLDivElement>(null);

  // ── Layer 2: canvas refs ─────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tgtPos = useRef({ x: -9999, y: -9999 });
  const curPos = useRef({ x: -9999, y: -9999 });
  const isHovering = useRef(false); // true while cursor is inside the hero
  const fadeVal = useRef(0);        // 0–1, lerped for smooth enter/leave

  // ── Canvas setup ─────────────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // Skip canvas entirely on touch/mobile devices — no fine-pointer cursor means
    // the blob reveal never fires anyway; saves significant CPU on iOS/Android.
    const isTouchDevice = !window.matchMedia("(pointer: fine)").matches;
    if (isTouchDevice) return;

    const canvas = canvasRef.current!;
    const container = containerRef.current!;

    const isMobileRef = { current: container.offsetWidth < 768 };

    const ro = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      isMobileRef.current = container.offsetWidth < 768;
    });
    ro.observe(container);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Preload wireframe image — drawn on canvas as the "always-visible" base layer
    const bgFront = new Image();
    bgFront.src = "/images/hero-bg-front4.webp";

    // ── Marching squares iso-contour approach ────────────────────────────────
    // Contour lines of a continuous scalar field NEVER cross each other.
    // Height field h(x,y) = sum of Gaussian "hills". Marching squares extracts
    // iso-lines at evenly-spaced levels → topographic map, zero crossings.

    // Edge table for marching squares (bits: TL=8, TR=4, BR=2, BL=1).
    // Each entry is a list of [edgeA, edgeB] segment(s) to draw.
    // Edges: 0=bottom, 1=right, 2=top, 3=left
    const MS_SEGS: Array<Array<[number, number]>> = [
      [],              // 0  0000
      [[3, 0]],        // 1  0001 BL
      [[0, 1]],        // 2  0010 BR
      [[3, 1]],        // 3  0011 BL+BR
      [[1, 2]],        // 4  0100 TR
      [[1, 2],[3, 0]], // 5  0101 TR+BL saddle
      [[0, 2]],        // 6  0110 TR+BR
      [[3, 2]],        // 7  0111 TR+BR+BL
      [[2, 3]],        // 8  1000 TL
      [[2, 0]],        // 9  1001 TL+BL
      [[2, 3],[0, 1]], // 10 1010 TL+BR saddle
      [[2, 1]],        // 11 1011 TL+BR+BL
      [[1, 3]],        // 12 1100 TL+TR
      [[1, 0]],        // 13 1101 TL+TR+BL
      [[0, 3]],        // 14 1110 TL+TR+BR
      [],              // 15 1111
    ];

    // Gaussian "mountains" — cx/cy normalised [0,1], r fraction of H, A peak height
    // fx/fy = position oscillation frequencies (rad/s), phx/phy = phases
    const mountains = [
      { cx: 0.82, cy: 0.22, r: 0.40, A: 1.00, fx: 0.08, fy: 0.06, phx: 0.00, phy: 0.00 },
      { cx: 0.08, cy: 0.50, r: 0.36, A: 0.88, fx: 0.07, fy: 0.05, phx: 1.30, phy: 0.90 },
      { cx: 0.56, cy: 0.88, r: 0.38, A: 0.82, fx: 0.06, fy: 0.07, phx: 2.10, phy: 1.80 },
      { cx: 0.36, cy: 0.08, r: 0.30, A: 0.72, fx: 0.09, fy: 0.06, phx: 3.20, phy: 2.50 },
      { cx: 0.96, cy: 0.76, r: 0.32, A: 0.78, fx: 0.07, fy: 0.08, phx: 4.10, phy: 3.30 },
      // Wide background hill — ensures outermost contours span the full canvas
      { cx: 0.50, cy: 0.50, r: 0.78, A: 0.16, fx: 0.03, fy: 0.02, phx: 0.70, phy: 1.40 },
    ];

    // 20 iso-levels spanning from near-zero (large outer contours) to near-peak
    const N_LEVELS = 20;
    const LEVELS = Array.from({ length: N_LEVELS }, (_, i) => 0.05 + i * 0.058);

    // Grid: ~7px cells at typical 1440px wide → smooth enough, fast enough
    const GW = 200, GH = 112;
    const hField = new Float32Array((GW + 1) * (GH + 1));

    // Cursor depression radius (px) — negative Gaussian pulls contours inward
    const CURSOR_R = 160;

    // Interpolate pixel coordinate along a cell edge at contour level `lv`
    const edgePt = (
      edge: number, gx: number, gy: number,
      tl: number, tr: number, br: number, bl: number,
      lv: number, W: number, H: number
    ): [number, number] => {
      let gxf: number, gyf: number;
      switch (edge) {
        case 0: gxf = gx + (lv - bl) / (br - bl); gyf = gy + 1; break;
        case 1: gxf = gx + 1; gyf = gy + 1 - (lv - br) / (tr - br); break;
        case 2: gxf = gx + (lv - tl) / (tr - tl); gyf = gy; break;
        default: gxf = gx; gyf = gy + 1 - (lv - bl) / (tl - bl); break;
      }
      return [(gxf / GW) * W, (gyf / GH) * H];
    };

    const draw = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, W, H);

      // Step 1: Wireframe base layer (replaces solid black)
      // Falls back to dark fill while image is loading on first frame
      ctx.globalCompositeOperation = "source-over";
      if (!isMobileRef.current) {
        if (bgFront.complete && bgFront.naturalWidth > 0) {
          ctx.drawImage(bgFront, 0, 0, W, H);
        } else {
          ctx.fillStyle = "#0A0A09";
          ctx.fillRect(0, 0, W, H);
        }
      }

      // Step 2: Lerp cursor position + fade value
      curPos.current.x += (tgtPos.current.x - curPos.current.x) * 0.072;
      curPos.current.y += (tgtPos.current.y - curPos.current.y) * 0.072;
      // fadeVal → 1 on hover, → 0 on leave (0.055 ≈ ~0.8s fade)
      fadeVal.current += ((isHovering.current ? 1 : 0) - fadeVal.current) * 0.055;

      // Step 3: Organic blob reveal (destination-out) — desktop only (requires mouse)
      // A closed Catmull-Rom spline filled with a soft radial gradient punches
      // an organic, non-circular hole through the wireframe, revealing the portrait.
      const cursorActive = !isMobileRef.current && fadeVal.current > 0.01;
      if (cursorActive) {
        const cx = curPos.current.x, cy = curPos.current.y;
        const BLOB_R  = 150; // base radius (px)
        const N       = 14;  // control points — more = smoother undulation

        // Organic shape: two low-frequency harmonics on the radius, animated by time
        const blobPts = Array.from({ length: N }, (_, i) => {
          const angle = (2 * Math.PI * i) / N;
          const r = BLOB_R * fadeVal.current * (
            1.0
            + 0.18 * Math.sin(i * 2.0 + time * 0.28)
            + 0.10 * Math.sin(i * 3.3 + time * 0.17)
          );
          return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
        });

        // Closed Catmull-Rom → cubic bezier
        ctx.beginPath();
        ctx.moveTo(blobPts[0].x, blobPts[0].y);
        for (let i = 0; i < N; i++) {
          const p0 = blobPts[(i - 1 + N) % N];
          const p1 = blobPts[i];
          const p2 = blobPts[(i + 1) % N];
          const p3 = blobPts[(i + 2) % N];
          ctx.bezierCurveTo(
            p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
            p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
            p2.x, p2.y
          );
        }
        ctx.closePath();

        // Radial gradient fill: solid at centre → transparent at edge (soft reveal)
        const outerR = BLOB_R * fadeVal.current * 1.28;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
        grad.addColorStop(0.0,  "rgba(0,0,0,1.0)");
        grad.addColorStop(0.55, "rgba(0,0,0,0.95)");
        grad.addColorStop(0.85, "rgba(0,0,0,0.45)");
        grad.addColorStop(1.0,  "rgba(0,0,0,0.0)");

        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const t = time;
      const mx = curPos.current.x, my = curPos.current.y;

      // Pre-compute animated mountain centers once per frame (not per grid vertex).
      // Moves 12 Math.sin calls from inside the 22,713-iteration grid loop to just 12
      // total calls per frame — eliminates ~136K redundant sin evaluations/frame.
      const mPre = mountains.map(m => ({
        acx: (m.cx + 0.04 * Math.sin(t * m.fx + m.phx)) * W,
        acy: (m.cy + 0.03 * Math.sin(t * m.fy + m.phy)) * H,
        r2:  (m.r * H) ** 2,
        A:   m.A,
      }));

      // Step 4: Build height field
      for (let gy = 0; gy <= GH; gy++) {
        for (let gx = 0; gx <= GW; gx++) {
          const px = (gx / GW) * W;
          const py = (gy / GH) * H;
          let val = 0;

          for (const m of mPre) {
            const dx = px - m.acx, dy = py - m.acy;
            val += m.A * Math.exp(-(dx * dx + dy * dy) / (2 * m.r2));
          }

          // Cursor depression — local minimum pulls nearby contours inward (fades with reveal)
          if (cursorActive) {
            const dx = px - mx, dy = py - my;
            val -= 0.40 * fadeVal.current * Math.exp(-(dx * dx + dy * dy) / (2 * CURSOR_R * CURSOR_R));
          }

          hField[gy * (GW + 1) + gx] = val;
        }
      }

      // Step 5: Marching squares — one beginPath per level for uniform stroke
      for (let li = 0; li < N_LEVELS; li++) {
        const lv = LEVELS[li];
        // Outer contours slightly brighter; inner contours near-invisible
        const alpha = 0.55 - li * 0.010;
        if (alpha <= 0) continue;
        // Fiber-optic pulse: accent (#ECC15B) → white, phase-offset per level
        // so the "light" appears to travel across the contour field over time
        const phase = (Math.sin(t * 0.5 + li * 0.35) + 1) / 2; // 0 → 1
        const r = Math.round(236 + (255 - 236) * phase);
        const g = Math.round(193 + (255 - 193) * phase);
        const b = Math.round(91  + (255 - 91)  * phase);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.beginPath();

        for (let gy = 0; gy < GH; gy++) {
          for (let gx = 0; gx < GW; gx++) {
            const tl = hField[gy * (GW + 1) + gx];
            const tr = hField[gy * (GW + 1) + gx + 1];
            const br = hField[(gy + 1) * (GW + 1) + gx + 1];
            const bl = hField[(gy + 1) * (GW + 1) + gx];

            const mask =
              (tl >= lv ? 8 : 0) |
              (tr >= lv ? 4 : 0) |
              (br >= lv ? 2 : 0) |
              (bl >= lv ? 1 : 0);

            for (const [e0, e1] of MS_SEGS[mask]) {
              const [x0, y0] = edgePt(e0, gx, gy, tl, tr, br, bl, lv, W, H);
              const [x1, y1] = edgePt(e1, gx, gy, tl, tr, br, bl, lv, W, H);
              ctx.moveTo(x0, y0);
              ctx.lineTo(x1, y1);
            }
          }
        }
        ctx.stroke();
      }
    };

    // Pause the canvas ticker when the hero section is off-screen to avoid
    // running 22,400+ marching-squares computations per frame while invisible.
    let tickerActive = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tickerActive) {
          gsap.ticker.add(draw);
          tickerActive = true;
        } else if (!entry.isIntersecting && tickerActive) {
          gsap.ticker.remove(draw);
          tickerActive = false;
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    return () => {
      gsap.ticker.remove(draw);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // ── Mouse handlers ────────────────────────────────────────────────────────────
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    tgtPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isHovering.current = true;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    // tgtPos intentionally NOT reset — curPos stays at last position while fading out
  };

  // ── Set initial hidden state before first paint ───────────────────────────────
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(
      [labelRef.current, nameRef.current, dividerRef.current, taglineRef.current, ctaRef.current],
      { opacity: 0 }
    );
  }, []);

  // ── GSAP entrance timeline + ScrollTriggers — wait for preloader ──────────────
  useIsomorphicLayoutEffect(() => {
    if (!isLoaded) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Estado final imediato — sem animação
        gsap.set(
          [
            labelRef.current,
            nameRef.current,
            dividerRef.current,
            taglineRef.current,
            ctaRef.current,
          ],
          { clearProps: "all" }
        );
      } else {
        // Timeline de entrada — começa imediatamente após o preloader sair
        const tl = gsap.timeline();

        tl.from(labelRef.current, { y: -16, opacity: 0, duration: 0.5, ease: "power3.out" })

          // Nome: clipPath reveal da esquerda para a direita
          .from(nameRef.current, {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.0,
            ease: "power3.inOut",
          }, "-=0.2")

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
      }

      // Parallax wrapper — both image layers move together at 25% scroll speed
      gsap.to(parallaxWrapperRef.current, {
        y: "25%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Divider scroll-out: fromTo is explicit about both start and end states,
      // so scrub reversal always restores scaleX:1 / opacity:1 correctly.
      // Starts at 30% scroll (after name is well visible) → fully gone at hero bottom.
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 1, opacity: 1 },
        {
          scaleX: 0,
          opacity: 0,
          transformOrigin: "left",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "30% top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      // Text parallax exit — fromTo so scrub reversal always restores correctly
      gsap.fromTo(
        [taglineRef.current, ctaRef.current],
        { y: 0, opacity: 1, scale: 1 },
        {
          y: -50,
          opacity: 0,
          scale: 0.88,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "20% top",
            end: "80% top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        [labelRef.current, nameRef.current],
        { y: 0, opacity: 1, scale: 1 },
        {
          y: -30,
          opacity: 0,
          scale: 0.92,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "55% top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );

      // Ensure ScrollTrigger recalculates with final layout
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden min-h-screen flex flex-col justify-between pt-32 md:pt-40 pb-16 md:pb-24"
    >
      {/* Parallax wrapper — Layer 1 + Layer 2 move as one unit */}
      <div
        ref={parallaxWrapperRef}
        aria-hidden="true"
        className="absolute inset-0"
      >
        {/* Layer 1 — background image (CSS, position absolute) — desktop only */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: "url('/images/hero-bg8.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.72) saturate(0.85) sepia(0.08)",
          }}
        />

        {/* Layer 1 — background image mobile (no reveal effect on mobile) */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: "url('/images/bg-mobile2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.72) saturate(0.85) sepia(0.08)",
          }}
        />

        {/* Layer 2 — canvas: organic splines + cursor reveal mask */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 pointer-events-none w-full h-full"
        />
      </div>

      {/* Layer 1b — bottom gradient: fades hero into site bg colour (#0A0A09) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-64 z-[15] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #000000)",
        }}
      />

      {/* Layer 3 — text content */}
      <div className="w-full container-site relative z-20 flex flex-col justify-between flex-1">

        {/* Top group: label + name + subtitle */}
        <div>
          {/* Label acima do nome */}
          <div ref={labelRef} className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>
            Design · Build · Launch
          </div>

          {/* Nome — Rodrigo light italic / Alarcão extrabold */}
          <h1
            ref={nameRef}
            className="font-display text-hero-name text-text leading-[0.92] tracking-tight"
          >
            <span className="block font-light italic">Rodrigo</span>
            <span className="block font-extrabold">Alarcão</span>
          </h1>

        </div>

        {/* Bottom group: divider + tagline + CTA */}
        <div>
          {/* 1px accent divider */}
          <div
            ref={dividerRef}
            className="w-full md:w-1/2 border-t border-accent mb-8 md:mb-14"
          />

          {/* Tagline + CTA — editorial: texto à esquerda, CTA à direita */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
            <p
              ref={taglineRef}
              className="font-body text-text max-w-[480px] leading-[1.5] text-[1.125rem] md:text-[1.375rem]"
            >
              <span className="block font-semibold">
                {content.tagline}
              </span>
              <span className="block font-light italic mt-1">
                {content.taglineSub}
              </span>
            </p>

            {/* CTA */}
            <a
              ref={ctaRef}
              href={content.ctaHref}
              className="font-display font-medium text-[1.125rem] text-text hover:text-accent transition-colors duration-300 whitespace-nowrap group flex items-center gap-2"
            >
              {content.cta}
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
