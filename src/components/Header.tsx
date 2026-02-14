import Link from "next/link";
import Logo from "./Logo";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-foreground">
            PGY1
          </span>
          <span className="hidden text-sm font-medium text-muted sm:inline">
            Financial Solutions
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="#process"
            className="hidden text-sm text-muted hover:text-foreground sm:block"
          >
            How it works
          </a>
          <a
            href="#testimonials"
            className="hidden text-sm text-muted hover:text-foreground sm:block"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="hidden text-sm text-muted hover:text-foreground sm:block"
          >
            FAQ
          </a>
          <a
            href={`tel:${PHONE}`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  );
}
