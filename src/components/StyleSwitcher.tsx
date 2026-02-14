"use client";

import { useStyle, type StyleId } from "./StyleProvider";

const STYLES: { id: StyleId; label: string }[] = [
  { id: "1", label: "Style 1" },
  { id: "2", label: "Style 2" },
  { id: "3", label: "Style 3" },
];

export default function StyleSwitcher() {
  const { style, setStyle } = useStyle();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-lg border border-border bg-surface/95 p-1 shadow-lg backdrop-blur"
      role="group"
      aria-label="Switch visual style"
    >
      {STYLES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setStyle(id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            style === id
              ? "bg-accent text-accent-fg ring-2 ring-accent shadow-md"
              : "text-muted hover:bg-surface-muted hover:text-foreground"
          }`}
          aria-pressed={style === id}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
