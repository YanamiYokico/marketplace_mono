"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { Image } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { toggleFavorite } from "../api/favorites-api";

type FavoriteButtonProps = {
  productId: string;
  initialFavorite?: boolean;
  className?: string;
};

export function FavoriteButton({
  productId,
  initialFavorite = false,
  className,
}: FavoriteButtonProps) {
  const { token } = useSession();
  const router = useRouter();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pending, setPending] = useState(false);

  const handleClick = async (e: MouseEvent) => {
    // Guard against triggering a parent link/card.
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      router.push("/auth");
      return;
    }
    const prev = favorite;
    setFavorite(!prev); // optimistic
    setPending(true);
    try {
      const { status } = await toggleFavorite(token, productId);
      setFavorite(status === "added");
    } catch {
      setFavorite(prev); // revert on failure
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={favorite}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition disabled:opacity-60",
        favorite ? "bg-[#5A8A02] ring-2 ring-[#5A8A02]" : "bg-white/70 hover:bg-white",
        className,
      )}
    >
      <Image
        src="/images/icons/like_icon.svg"
        alt=""
        aria-hidden
        className={cn("h-5 w-5", favorite && "brightness-0 invert")}
      />
    </button>
  );
}
