"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pgy1-style";

export type StyleId = "1" | "2" | "3";

type StyleContextValue = {
  style: StyleId;
  setStyle: (id: StyleId) => void;
};

const StyleContext = createContext<StyleContextValue | null>(null);

function getInitialStyle(): StyleId {
  if (typeof window === "undefined") return "1";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "1" || stored === "2" || stored === "3") return stored;
  return "1";
}

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<StyleId>("1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStyleState(getInitialStyle());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-style", style);
    localStorage.setItem(STORAGE_KEY, style);
  }, [mounted, style]);

  const setStyle = useCallback((id: StyleId) => {
    setStyleState(id);
  }, []);

  const value = useMemo(() => ({ style, setStyle }), [style, setStyle]);

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
}

export function useStyle() {
  const ctx = useContext(StyleContext);
  if (!ctx) throw new Error("useStyle must be used within StyleProvider");
  return ctx;
}
