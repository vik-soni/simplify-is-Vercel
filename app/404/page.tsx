import { ErrorPage } from "@/components/error/ErrorPage";

export default function NotFoundRoutePage() {
  return (
    <ErrorPage
      code="404"
      tag="404 · Page not found"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved. Here's where you might want to go next."
      ctaLabel="Back to Home"
      ctaHref="/"
    />
  );
}
