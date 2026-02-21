import { FAQ_ITEMS } from "@/lib/constants";

/**
 * Structured Data (Schema.org) for SEO
 * Adds LocalBusiness, Person, Review, and FAQPage schemas
 */

const BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "PGY1 Financial Solutions",
  alternateName: "PGY1 Financial Solutions Corp",
  description:
    "Disability insurance for residents and fellows. Get your GSI policy before it's too late. Jay Weinberg, CLU ChFC.",
  url: "https://pgy1.com",
  telephone: "+1-609-432-8862",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  serviceType: "Disability Insurance",
  priceRange: "$$",
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jay Weinberg",
  jobTitle: "CLU, ChFC",
  worksFor: {
    "@type": "FinancialService",
    name: "PGY1 Financial Solutions",
  },
  description:
    "Jay Weinberg, CLU ChFC, connects disability insurance to doctors — especially residents and fellows — so you can protect your income before it's too late.",
  telephone: "+1-609-432-8862",
};

const REVIEW_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "Sarah M.",
    },
    reviewBody:
      "Jay made the process simple and answered every question. I locked in my GSI during residency and now I have peace of mind.",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "David K.",
    },
    reviewBody:
      "I was worried about my medical history. He explained my options clearly and helped me get coverage without the stress I expected.",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "Jennifer L.",
    },
    reviewBody:
      "Not a big firm — just someone who actually picks up the phone. That mattered a lot during a busy rotation.",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      {REVIEW_SCHEMAS.map((review, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(review) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
    </>
  );
}
