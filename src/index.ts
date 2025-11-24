// String helpers
export function trimToNull(value: string | null | undefined): string | null {
  if (value == null) return null;

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function normalizeSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toSlug(value: string): string {
  return normalizeSpace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, "")
    .replace(/\s+/g, "-");
}

// Date helpers
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Async helpers
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs} ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result as T;
  } finally {
    clearTimeout(timeoutHandle!);
  }
}

// Error helpers
export function safeJsonParse<T = unknown>(
  value: string
): { ok: true; value: T } | { ok: false; error: Error } {
  try {
    const parsed = JSON.parse(value) as T;
    return { ok: true, value: parsed };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Invalid JSON")
    };
  }
}
