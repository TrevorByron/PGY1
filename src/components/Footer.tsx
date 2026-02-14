import Link from "next/link";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-foreground">PGY1</p>
            <p className="mt-1 text-sm text-muted">
              Financial Solutions Corp
            </p>
            <p className="mt-1 text-sm text-muted">Jay Weinberg, CLU ChFC</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <a
              href={`tel:${PHONE}`}
              className="mt-2 block text-muted hover:text-foreground"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href={`sms:${PHONE}`}
              className="mt-1 block text-sm text-muted hover:text-foreground"
            >
              Text anytime
            </a>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/#about" className="text-muted hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-muted hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/disability-101" className="text-muted hover:text-foreground">
                  Disability 101
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <p className="mt-2 text-sm text-muted">
              © {new Date().getFullYear()} Jay Weinberg. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
