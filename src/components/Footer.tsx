import Link from "next/link";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-dark-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-dark-fg">PGY1</p>
            <p className="mt-1 text-sm text-dark-muted">
              Financial Solutions Corp
            </p>
            <p className="mt-1 text-sm text-dark-muted">Jay Weinberg, CLU ChFC</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dark-fg">Contact</h3>
            <a
              href={`tel:${PHONE}`}
              className="mt-2 block text-dark-muted hover:text-dark-fg"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href={`sms:${PHONE}`}
              className="mt-1 block text-sm text-dark-muted hover:text-dark-fg"
            >
              Text anytime
            </a>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dark-fg">Explore</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/about" className="text-dark-muted hover:text-dark-fg">
                  About
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-dark-muted hover:text-dark-fg">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-dark-muted hover:text-dark-fg">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/disability-101" className="text-dark-muted hover:text-dark-fg">
                  Disability 101
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-dark-muted hover:text-dark-fg">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dark-fg">Legal</h3>
            <p className="mt-2 text-sm text-dark-muted">
              © {new Date().getFullYear()} Jay Weinberg. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
