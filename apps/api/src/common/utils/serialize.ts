import { Prisma } from "@prisma/client";

export function paginate(page?: number, limit?: number) {
  const p = page ?? 1;
  const l = Math.min(limit ?? 20, 100);
  return { page: p, limit: l, skip: (p - 1) * l };
}

export function paginatedResult<T>(data: T[], total: number, page: number, limit: number) {
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function serializeDates<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj } as Record<string, unknown>;
  for (const [key, value] of Object.entries(result)) {
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (value instanceof Prisma.Decimal) {
      result[key] = value.toString();
    }
  }
  return result as T;
}

export function computeDocumentStatus(expiresAt: Date | null): "VALID" | "EXPIRING" | "EXPIRED" | "PENDING_REVIEW" {
  if (!expiresAt) return "PENDING_REVIEW";
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0) return "EXPIRED";
  if (days <= 30) return "EXPIRING";
  return "VALID";
}
