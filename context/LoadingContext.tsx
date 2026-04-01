"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextType {
  isLoaded: boolean;
  setLoaded: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoaded: false,
  setLoaded: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoaded, setLoaded: () => setIsLoaded(true) }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
