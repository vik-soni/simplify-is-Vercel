import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://simplify.is"),
});

const clientResult = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "https://simplify.is",
});

if (!clientResult.success) {
  const names = clientResult.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(`Client environment variable validation failed: ${names}`);
}

export const clientConfig = clientResult.data;

/** Static showcase build — no server secrets required. */
export const config = {} as Record<string, never>;
