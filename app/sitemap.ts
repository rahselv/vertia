import type { MetadataRoute } from "next";
import { artikler } from "@/lib/artikler";

const BASE_URL = "https://vertia.no";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/om-oss`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artikler`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...artikler.map((artikkel) => ({
      url: `${BASE_URL}/artikler/${artikkel.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
