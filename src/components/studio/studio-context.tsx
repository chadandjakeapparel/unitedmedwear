"use client";

import { createContext, useContext, useState } from "react";

// Carries the design studio's summary into the quote form.
type StudioDesign = { summary: string; hasLogo: boolean } | null;

const StudioContext = createContext<{
  design: StudioDesign;
  setDesign: (design: StudioDesign) => void;
}>({ design: null, setDesign: () => {} });

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [design, setDesign] = useState<StudioDesign>(null);
  return (
    <StudioContext.Provider value={{ design, setDesign }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudioDesign() {
  return useContext(StudioContext);
}
