import { ErrorPage } from "@/components/error/ErrorPage";

export const dynamic = "force-dynamic";

export default function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      tag="403 · Access forbidden"
      title="Access forbidden"
      description="You don't have permission to view this area. If you believe this is wrong, sign in with the right account or ask your organisation owner to grant access."
      ctaLabel="Join the waitlist"
      waitlistCta
    />
  );
}
