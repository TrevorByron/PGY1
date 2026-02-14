import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pgy1.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/disability-101`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog/when-to-get-disability-insurance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/gsi-vs-fully-underwritten`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/own-occupation-explained`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
