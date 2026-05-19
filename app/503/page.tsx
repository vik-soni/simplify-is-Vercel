import { ErrorPage } from "@/components/error/ErrorPage";

export const dynamic = "force-dynamic";

export default function UnavailablePage() {
  return (
    <ErrorPage
      code="503"
      tag="503 · Service unavailable"
      title="Service temporarily unavailable"
      description="We're performing maintenance and expect to recover shortly. If this persists, please try again in a few minutes or get in touch."
      ctaLabel="Retry"
      ctaHref="/"
    />
  );
}
