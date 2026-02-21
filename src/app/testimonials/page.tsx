import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BottomCTASection from "@/components/BottomCTASection";

export const metadata: Metadata = {
  title: "Testimonials | PGY1 Financial Solutions",
  description:
    "Hear from just a few of the 10K+ residents, fellows, and attendings PGY-1 has helped into a policy. Real feedback from physicians who secured GSI and own-occupation coverage.",
  openGraph: {
    title: "Testimonials | PGY1 Financial Solutions",
    description:
      "What physicians say about working with Jay Weinberg for disability insurance.",
  },
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
    quote: "Quick, clear, no pressure. Exactly what I needed.",
    name: "Alex N.",
    title: "Resident, Anesthesiology",
    avatar: AVATARS[9],
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
      "As a surgeon, I needed true own-occupation coverage. Jay found me the right policy and walked me through every detail. He knows the ins and outs of disability insurance for physicians and made sure I understood exactly what I was buying. Highly recommend.",
    name: "James P.",
    title: "Attending, General Surgery",
    avatar: AVATARS[5],
  },
  {
    quote:
      "Quick responses, no pressure. He helped me understand what I was buying and why it mattered for my specialty.",
    name: "Emily T.",
    title: "Fellow, Dermatology",
    avatar: AVATARS[4],
  },
  {
    quote: "Got my policy in place in no time. Very straightforward.",
    name: "Priya S.",
    title: "Resident, Psychiatry",
    avatar: AVATARS[10],
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
      "I appreciated that he didn't push me toward anything. Just explained my options and let me decide what was right. After talking to a few other people, I went back to Jay because he was the only one who took time to answer my questions without trying to upsell.",
    name: "Robert H.",
    title: "Fellow, Cardiology",
    avatar: AVATARS[7],
  },
  {
    quote:
      "I was on the fence about disability insurance during fellowship. Jay explained why locking in GSI now would save me money and hassle later. I'm glad I listened.",
    name: "Maria G.",
    title: "Fellow, Gastroenterology",
    avatar: AVATARS[11],
  },
  {
    quote: "Professional, responsive, and actually cares.",
    name: "Kevin L.",
    title: "Attending, Hospitalist",
    avatar: AVATARS[12],
  },
  {
    quote:
      "My program pointed me to Jay and I'm glad they did. He made it easy to get the right coverage without wasting time. I had a policy in place before I finished residency.",
    name: "Amanda W.",
    title: "Resident, OB/GYN",
    avatar: AVATARS[13],
  },
  {
    quote:
      "I had a lot of questions about pre-existing conditions and how they'd affect my application. Jay walked me through it step by step and helped me get approved. Couldn't have asked for a better experience.",
    name: "Chris B.",
    title: "Fellow, Pulmonology",
    avatar: AVATARS[8],
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
            Hear from just a few of the 10K+ residents, fellows, and attendings PGY-1 has helped into a policy.
          </p>
        </div>

        {/* Pinterest-style masonry grid with bottom gradient overlay */}
        <div className="relative mt-12">
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
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
          {/* Gradient overlay to smooth jagged bottom of masonry */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-section to-transparent"
            aria-hidden
          />
        </div>
      </div>
      <BottomCTASection />
    </main>
  );
}
