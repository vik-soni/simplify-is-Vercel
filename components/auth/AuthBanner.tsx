export function AuthBanner({
  kind = "success",
  message,
}: {
  kind?: "success" | "error";
  message: string;
}) {
  const classes =
    kind === "success"
      ? "border-success/40 bg-success/10 text-success"
      : "border-danger/40 bg-danger/10 text-danger";

  return <div className={`rounded-md border px-3 py-2 text-sm ${classes}`}>{message}</div>;
}

