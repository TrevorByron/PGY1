import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { Playfair_Display, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StyleProvider } from "@/components/StyleProvider";
import StyleSwitcher from "@/components/StyleSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-style3-heading",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-style3-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pgy1.com"),
  title: {
    default: "Physician Disability Insurance | PGY1 Financial Solutions",
    template: "%s | PGY1 Financial Solutions",
  },
  description:
    "Disability insurance for residents and fellows. Get your GSI policy before it's too late. 1 min quote — 100% private. Jay Weinberg, CLU ChFC.",
  openGraph: {
    title: "Physician Disability Insurance | PGY1 Financial Solutions",
    description:
      "Disability insurance for residents and fellows. Get your GSI policy before it's too late.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${playfair.variable} ${oswald.variable} antialiased`}>
        <StyleProvider>
          <Header />
          {children}
          <Footer />
          <StyleSwitcher />
        </StyleProvider>
      </body>
    </html>
  );
}
