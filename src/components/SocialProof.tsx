const TESTIMONIALS = [
  {
    quote:
      "Jay made the process simple and answered every question. I locked in my GSI during residency and now I have peace of mind.",
    name: "Sarah M.",
    title: "Resident, Internal Medicine",
  },
  {
    quote:
      "I was worried about my medical history. He explained my options clearly and helped me get coverage without the stress I expected.",
    name: "David K.",
    title: "Fellow, Cardiology",
  },
  {
    quote:
      "Not a big firm — just someone who actually picks up the phone. That mattered a lot during a busy rotation.",
    name: "Jennifer L.",
    title: "Resident, Pediatrics",
  },
];

const CARRIERS = ["Guardian", "Mass Mutual", "Principal", "Ameritas", "The Standard"];
const HOSPITALS = ["Select institutions nationwide"];

export default function SocialProof() {
  return (
    <section id="testimonials" className="bg-section py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">5+</p>
            <p className="mt-1 text-sm text-muted">Carriers we work with</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">Years</p>
            <p className="mt-1 text-sm text-muted">Years helping physicians</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">GSI</p>
            <p className="mt-1 text-sm text-muted">Available at select programs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">50</p>
            <p className="mt-1 text-sm text-muted">States licensed</p>
          </div>
        </div>

        {/* Carriers */}
        <div className="mt-16 border-t border-border pt-16">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-subtle">
            We work with top carriers
          </h3>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
            {CARRIERS.map((name) => (
              <span
                key={name}
                className="text-lg font-medium text-muted"
              >
                {name}
              </span>
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-muted-subtle">
            So you get the best fit for your situation.
          </p>
        </div>

        {/* Trusted by */}
        <div className="mt-12 border-t border-border pt-12">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-subtle">
            Trusted by residents and fellows at
          </h3>
          <p className="mt-4 text-center text-muted">
            {HOSPITALS.join(" · ")}
          </p>
        </div>

        {/* Wall of Love */}
        <div className="mt-16 border-t border-border pt-16">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            What physicians say
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={i}
                className="rounded-xl border border-border bg-section-muted p-6"
              >
                <p className="text-muted">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted">{t.title}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
