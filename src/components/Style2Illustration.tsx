"use client";

const ILLUSTRATIONS: Record<string, string> = {
  "online-doctor": "/illustrations/online-doctor.svg",
  doctor: "/illustrations/doctor.svg",
  cardiologist: "/illustrations/cardiologist.svg",
  "gynecology-consultation": "/illustrations/gynecology-consultation.svg",
  "hospital-wheelchair": "/illustrations/hospital-wheelchair.svg",
  laboratory: "/illustrations/laboratory.svg",
  "medical-prescription": "/illustrations/medical-prescription.svg",
};

type IllustrationId = keyof typeof ILLUSTRATIONS;

export default function Style2Illustration({
  id,
  alt = "",
  className = "h-auto w-full max-w-sm object-contain",
}: {
  id: IllustrationId;
  alt?: string;
  className?: string;
}) {
  const src = ILLUSTRATIONS[id];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={!alt}
      className={className}
    />
  );
}
