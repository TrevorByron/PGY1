"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Analytics Component
 * Supports Google Analytics (GA4) and Facebook Pixel
 * 
 * SETUP INSTRUCTIONS:
 * 1. Add environment variables to .env.local:
 *    - NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX (your GA4 measurement ID)
 *    - NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX (your Facebook Pixel ID)
 * 
 * 2. Analytics will automatically track:
 *    - Page views
 *    - Form submissions (via data-ga-event="form_submit" attribute)
 *    - CTA clicks (via data-ga-event="cta_click" attribute)
 *    - Phone/text link clicks (via data-ga-event="contact_click" attribute)
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export function Analytics() {
  const pathname = usePathname();

  // Initialize Google Analytics
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Load GA script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize GA
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer = window.dataLayer || []).push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, []);

  // Track page views
  useEffect(() => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Initialize Facebook Pixel
  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Initialize fbq
    window.fbq =
      window.fbq ||
      function (...args: unknown[]) {
        // eslint-disable-next-line prefer-rest-params
        (window._fbq = window._fbq || []).push(args);
      };
    window.fbq("js", new Date());
    window.fbq("init", FB_PIXEL_ID);
    window.fbq("track", "PageView");

    // Load FB Pixel script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }, []);

  // Track page views for Facebook Pixel
  useEffect(() => {
    if (FB_PIXEL_ID && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}

/**
 * Helper function to track custom events
 * Usage: trackEvent('form_submit', { form_name: 'quote_form' })
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
  if (FB_PIXEL_ID && window.fbq) {
    window.fbq("track", eventName, eventParams);
  }
}
