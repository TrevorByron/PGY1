# Hospital / institution logos

Add logo image files here (PNG, JPG, or SVG), then list their filenames in `src/components/SocialProof.tsx` in the `HOSPITAL_LOGO_FILES` array.

Example: if you add `acme-medical.png` and `city-hospital.svg`, in SocialProof.tsx set:

```ts
const HOSPITAL_LOGO_FILES: string[] = [
  "acme-medical.png",
  "city-hospital.svg",
];
```

Logos will appear under "Trusted by residents and fellows at".
