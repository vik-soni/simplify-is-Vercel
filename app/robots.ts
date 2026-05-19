import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/how-it-works", "/frameworks", "/pricing", "/maturity-model", "/meet-cypher", "/terms", "/privacy", "/login", "/signup", "/forgot-password", "/reset-password"],
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://simplify.is/sitemap.xml",
  };
}

