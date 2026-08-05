"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Illustrativ visningsteller. Starter på et basetall (satt per artikkel) og
 * øker med 1 hver gang artikkelen åpnes i nettleseren. Opptellingen lagres i
 * localStorage per artikkel, slik at tallet vokser over tid. Ingen data sendes.
 */
export default function ArticleViews({
  slug,
  base,
}: {
  slug: string;
  base: number;
}) {
  const [views, setViews] = useState(base);

  useEffect(() => {
    const key = `vertia_views_${slug}`;
    const stored = Number(localStorage.getItem(key) ?? "0");
    const next = stored + 1;
    localStorage.setItem(key, String(next));
    setViews(base + next);
  }, [slug, base]);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-ink-500/70">
      <Eye className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      {new Intl.NumberFormat("nb-NO").format(views)} visninger
    </span>
  );
}
