export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
