import { useEffect, useLayoutEffect } from "react";

// Usar em todos os componentes com GSAP — nunca useLayoutEffect directamente.
// Previne erros de SSR: no servidor usa useEffect (sem DOM), no cliente usa useLayoutEffect.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
