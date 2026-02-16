"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

/**
 * Facepile component showing avatars with "Helping over 10,000 residents & fellows over 20+ years" text
 * Uses real human headshots from Unsplash
 * Dynamically adjusts the number of faces shown based on container width
 */
export default function Facepile({ centered = false }: { centered?: boolean }) {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [maxFaces, setMaxFaces] = useState<number>(5); // Start conservative, will update after measurement
  const containerRef = useRef<HTMLDivElement>(null);
  const facepileRowRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const calculateMaxFaces = () => {
      if (!facepileRowRef.current || !containerRef.current) return;

      // Use requestAnimationFrame to ensure measurement happens after layout
      requestAnimationFrame(() => {
        if (!facepileRowRef.current) return;
        
        // Get the actual available width - use the facepile row's clientWidth
        // This gives us the inner width excluding scrollbars
        const containerWidth = facepileRowRef.current.clientWidth;
        
        if (containerWidth === 0) return; // Not ready yet
        
        // Face sizes: mobile = 40px (h-10 w-10), desktop = 48px (sm:h-12 sm:w-12)
        // Overlap: -space-x-2 = 8px (0.5rem)
        // Check if we're on mobile or desktop based on container width
        const isMobile = containerWidth < 640; // sm breakpoint
        const faceSize = isMobile ? 40 : 48;
        const overlap = 8; // -space-x-2 = 8px
        
        // Formula for total width with n faces:
        // totalWidth = faceSize + (n-1) * (faceSize - overlap)
        // Solving for n: n = 1 + (totalWidth - faceSize) / (faceSize - overlap)
        
        // Be very conservative: use larger buffer and subtract more from result
        // This accounts for sub-pixel rendering, borders, and rounding errors
        const buffer = 20; // Increased buffer to prevent overflow
        const availableWidth = Math.max(0, containerWidth - buffer);
        
        if (availableWidth < faceSize) {
          setMaxFaces(1);
          return;
        }
        
        // Calculate max faces conservatively
        // Formula: totalWidth = faceSize + (n-1) * (faceSize - overlap)
        // Solving: n = 1 + (totalWidth - faceSize) / (faceSize - overlap)
        const calculatedCount = Math.floor((availableWidth - faceSize) / (faceSize - overlap)) + 1;
        // Subtract 2 to be extra safe and prevent any overflow
        const maxCount = Math.max(1, calculatedCount - 2);
        
        // Ensure at least 1 face, and cap at total available headshots
        const clampedCount = Math.max(1, Math.min(maxCount, headshots.length));
        setMaxFaces(clampedCount);
      });
    };

    // Calculate on mount (with a delay to ensure DOM is ready)
    const timeoutId = setTimeout(() => {
      calculateMaxFaces();
    }, 100);

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      calculateMaxFaces();
    });

    // Observe both the container and facepile row to catch all resize events
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (facepileRowRef.current) {
      resizeObserver.observe(facepileRowRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener("resize", calculateMaxFaces);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateMaxFaces);
    };
  }, [headshots.length]);

  // Filter out failed images and limit to maxFaces
  const visibleHeadshots = headshots
    .slice(0, maxFaces)
    .filter((_, i) => !failedImages.has(i));

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col gap-3 ${centered ? "items-center" : "items-start"}`}
    >
      <div ref={facepileRowRef} className="flex items-center -space-x-2 w-full overflow-hidden">
        {visibleHeadshots.map((src, i) => {
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
