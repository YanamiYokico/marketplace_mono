import { useState } from "react";
import { cn } from "@/shared/lib";

const FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
};

export function Image({ src, alt, className, fallback = FALLBACK_SRC }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setImgSrc(fallback)}
    />
  );
}
