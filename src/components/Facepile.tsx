"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Facepile component showing avatars with "Helping over 10,000 residents & fellows over 20+ years" text
 * Uses real human headshots from Unsplash
 */
export default function Facepile({ centered = false }: { centered?: boolean }) {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };
  // Unsplash photo IDs for diverse professional headshots
  // Using verified Unsplash photo IDs that reliably load
  const headshots = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=faces",
  ];

  return (
    <div className={`flex flex-col gap-3 ${centered ? "items-center" : "items-start"}`}>
      <div className="flex items-center -space-x-2">
        {headshots.map((src, i) => {
          if (failedImages.has(i)) {
            return null;
          }
          return (
            <div
              key={i}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-hero-card-bg bg-hero-card-bg sm:h-12 sm:w-12"
              aria-hidden
            >
              <Image
                src={src}
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-cover"
                onError={() => handleImageError(i)}
              />
            </div>
          );
        })}
      </div>
      <p className={`text-sm font-medium text-hero-fg-muted sm:text-base ${centered ? "text-center" : "text-left"}`}>
        Helping over 10,000 residents & fellows over 20+ years
      </p>
    </div>
  );
}
