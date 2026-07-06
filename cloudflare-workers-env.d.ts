declare module "cloudflare:workers" {
  import type { drizzle } from "drizzle-orm/d1";

  type D1Binding = Parameters<typeof drizzle>[0];

  export const env: {
    DB?: D1Binding;
  };
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = unknown;
