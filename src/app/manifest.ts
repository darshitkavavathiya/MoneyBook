import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MoneyBook",
    short_name: "MoneyBook",
    description:
      "Personal Finance Tracker — Track income, expenses, shared costs, and more.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    orientation: "portrait",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
