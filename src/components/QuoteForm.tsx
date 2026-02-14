"use client";

/**
 * Fillout embed: replace FILLOUT_FORM_ID with your form ID from fillout.com
 * Example: https://form.fillout.com/t/ABC123
 * Or use iframe: <iframe src="https://form.fillout.com/t/YOUR_FORM_ID" ... />
 */
const FILLOUT_FORM_ID = "YOUR_FILLOUT_FORM_ID";

export default function QuoteForm() {
  const filloutUrl = `https://form.fillout.com/t/${FILLOUT_FORM_ID}`;

  return (
    <section id="get-quote" className="bg-section-muted py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get your quote
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted">
          Takes about 1 minute to get started. We never sell your information — 100% private.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <p className="mb-4 text-center text-base text-muted">
            We never sell your information. 100% private.
          </p>
          {FILLOUT_FORM_ID === "YOUR_FILLOUT_FORM_ID" ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-section-muted p-8 text-center">
              <p className="font-medium text-muted">
                Fillout form will appear here
              </p>
              <p className="mt-2 text-sm text-muted-subtle">
                Add your Fillout form ID in <code className="rounded bg-border px-1.5 py-0.5">src/components/QuoteForm.tsx</code> (FILLOUT_FORM_ID), or replace this block with your Fillout embed code.
              </p>
              <a
                href="https://www.fillout.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-medium text-foreground underline"
              >
                Get a Fillout form →
              </a>
            </div>
          ) : (
            <iframe
              title="Get your quote"
              src={filloutUrl}
              className="h-[600px] w-full rounded-xl border-0"
            />
          )}
          <p className="mt-4 text-center text-base text-muted-subtle">
            Prefer to talk? Text or call <a href="tel:6094328862" className="font-medium text-foreground underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">(609) 432-8862</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
