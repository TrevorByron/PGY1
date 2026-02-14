"use client";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

export default function CTABlock() {
  return (
    <section className="bg-dark-bg py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-dark-fg sm:text-3xl">
          Get your quote — 1 min, 100% private
        </h2>
        <p className="mt-3 text-dark-muted">
          100% private · No obligation
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#get-quote"
            className="inline-flex items-center justify-center rounded-full bg-cta-primary-bg px-8 py-4 text-base font-semibold text-cta-primary-fg transition hover:bg-cta-primary-hover"
          >
            Start in 1 minute
          </a>
          <span className="text-dark-muted-subtle">or</span>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center justify-center rounded-full border border-cta-outline-border px-8 py-4 text-base font-medium text-cta-outline-fg transition hover:bg-cta-outline-hover"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
        <p className="mt-6 text-sm text-dark-muted-subtle">
          Not a big company — here&apos;s my mobile number. Text or call anytime.
        </p>
        <a
          href={`sms:${PHONE}`}
          className="mt-2 inline-block text-sm font-medium text-dark-fg hover:underline"
        >
          Prefer text? I&apos;ll respond quickly.
        </a>
      </div>
    </section>
  );
}
