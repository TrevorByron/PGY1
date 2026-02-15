"use client";

import Image from "next/image";

const CARRIERS: { name: string; src: string; alt: string }[] = [
  { name: "Guardian", src: "/carriers/Guardian-logo-dark.png", alt: "Guardian" },
  { name: "Mass Mutual", src: "/carriers/MassMutual.jpg", alt: "Mass Mutual" },
  { name: "Principal", src: "/carriers/principal.png", alt: "Principal" },
  { name: "Ameritas", src: "/carriers/Ameritas_Bison_color.png", alt: "Ameritas" },
  { name: "The Standard", src: "/carriers/the_standard.svg", alt: "The Standard" },
];

export default function TopCarriers() {
  return (
    <section id="carriers" className="border-t border-border bg-section py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-base font-semibold uppercase tracking-wider text-muted-subtle sm:text-lg">
          We work with top carriers
        </h3>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-12 sm:gap-16">
          {CARRIERS.map((carrier) => (
            <div
              key={carrier.name}
              className="relative flex h-16 w-36 items-center justify-center sm:h-20 sm:w-40"
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
        <p className="mt-6 text-center text-base text-muted-subtle">
          So you get the best fit for your situation.
        </p>
      </div>
    </section>
  );
}
