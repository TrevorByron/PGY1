import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Testimonials | PGY1 Financial Solutions",
  description:
    "What physicians say about working with Jay Weinberg for disability insurance.",
};

// Avatar URLs from Facepile component
const AVATARS = [
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

const TESTIMONIALS = [
  {
    quote:
      "Jay made the process simple and answered every question. I locked in my GSI during residency and now I have peace of mind.",
    name: "Sarah M.",
    title: "Resident, Internal Medicine",
    avatar: AVATARS[0],
  },
  {
    quote:
      "I was worried about my medical history. He explained my options clearly and helped me get coverage without the stress I expected.",
    name: "David K.",
    title: "Fellow, Cardiology",
    avatar: AVATARS[1],
  },
  {
    quote:
      "Not a big firm — just someone who actually picks up the phone. That mattered a lot during a busy rotation.",
    name: "Jennifer L.",
    title: "Resident, Pediatrics",
    avatar: AVATARS[2],
  },
  {
    quote:
      "I didn't realize how important GSI was until Jay explained it. Got it locked in before applying elsewhere. So glad I did.",
    name: "Michael R.",
    title: "Resident, Emergency Medicine",
    avatar: AVATARS[3],
  },
  {
    quote:
      "Quick responses, no pressure. He helped me understand what I was buying and why it mattered for my specialty.",
    name: "Emily T.",
    title: "Fellow, Dermatology",
    avatar: AVATARS[4],
  },
  {
    quote:
      "As a surgeon, I needed true own-occupation coverage. Jay found me the right policy and walked me through every detail.",
    name: "James P.",
    title: "Attending, General Surgery",
    avatar: AVATARS[5],
  },
  {
    quote:
      "The whole process took less time than I expected. Jay handled everything and I had my policy in place quickly.",
    name: "Lisa C.",
    title: "Resident, Family Medicine",
    avatar: AVATARS[6],
  },
  {
    quote:
      "I appreciated that he didn't push me toward anything. Just explained my options and let me decide what was right.",
    name: "Robert H.",
    title: "Fellow, Cardiology",
    avatar: AVATARS[7],
  },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to home
        </Link>
        <div className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            What physicians say
          </h1>
          <p className="mt-4 text-lg text-muted">
            Real feedback from residents, fellows, and attendings who've worked with Jay.
          </p>
        </div>

        {/* Pinterest-style masonry grid */}
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={i}
              className="mb-6 break-inside-avoid rounded-xl border border-border bg-section-muted p-6 shadow-sm"
            >
              <p className="text-muted">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-border bg-border">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted">{testimonial.title}</p>
                </div>
              </footer>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-section-muted p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to get your quote?
          </h2>
          <p className="mt-2 text-muted">
            Take 2 mins to get a quote — 100% private.
          </p>
          <Link
            href="/quote"
            className="mt-6 inline-block rounded-full bg-accent px-8 py-4 font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Take 2 mins to get a quote
          </Link>
        </div>
      </div>
    </main>
  );
}
