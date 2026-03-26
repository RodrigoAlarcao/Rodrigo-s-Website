import { useEffect, RefObject } from "react";
import gsap from "gsap";

/**
 * Magnetic hover effect — element follows the cursor slightly when hovered.
 * Snaps back with an elastic spring on mouse leave.
 * No-op on touch devices.
 */
export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T>,
  strength = 0.35
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      gsap.to(el, {
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.45)",
      });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [ref, strength]);
}
