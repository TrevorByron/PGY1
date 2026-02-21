"use client";

import Image from "next/image";

const CARRIERS: { name: string; src: string; alt: string }[] = [
  { name: "Guardian", src: "/carriers/Guardian-logo-dark.png", alt: "Guardian Life Insurance Company disability insurance provider" },
  { name: "Mass Mutual", src: "/carriers/MassMutual.jpg", alt: "MassMutual disability insurance provider" },
  { name: "Principal", src: "/carriers/principal.png", alt: "Principal Financial Group disability insurance provider" },
  { name: "Ameritas", src: "/carriers/Ameritas_Bison_color.png", alt: "Ameritas disability insurance provider" },
  { name: "The Standard", src: "/carriers/the_standard.svg", alt: "The Standard disability insurance provider" },
];

export default function TopCarriers() {
  // Duplicate carriers for seamless loop
  const duplicatedCarriers = [...CARRIERS, ...CARRIERS];

  return (
    <section id="carriers" className="border-t border-border bg-section py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-base font-semibold uppercase tracking-wider text-muted-subtle sm:text-lg">
          We work with top carriers
        </h3>
        <div className="mt-10 overflow-hidden">
          <div className="flex animate-scroll items-center gap-8 sm:gap-16">
            {duplicatedCarriers.map((carrier, index) => (
              <div
                key={`${carrier.name}-${index}`}
                className="relative flex h-16 w-36 shrink-0 items-center justify-center sm:h-20 sm:w-40"
              >
                <Image
                  src={carrier.src}
                  alt={carrier.alt}
                  width={160}
                  height={80}
                  className="max-h-16 w-auto max-w-[9rem] object-contain object-center sm:max-h-20 sm:max-w-[10rem]"
                />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-base text-muted-subtle">
          So you get the best fit for your situation.
        </p>
      </div>
    </section>
  );
}
