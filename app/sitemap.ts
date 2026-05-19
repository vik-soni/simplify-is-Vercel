import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/how-it-works",
    "/frameworks",
    "/pricing",
    "/maturity-model",
    "/meet-cypher",
    "/terms",
    "/privacy",
    "/login",
    "/signup",
    "/403",
    "/404",
    "/500",
    "/503",
  ];

  return routes.map((route) => ({
    url: `https://simplify.is${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
