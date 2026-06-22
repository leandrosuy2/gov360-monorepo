export type OpportunityStatus =
  | "NEW"
  | "ANALYZING"
  | "APPROVED"
  | "REJECTED"
  | "IGNORED"
  | "FAVORITED"
  | "CONVERTED";

import type { Priority } from "./common";

export interface Opportunity {
  id: string;
  externalId: string | null;
  title: string;
  object: string;
  agency: string;
  source: string;
  modality: string | null;
  state: string | null;
  city: string | null;
  estimatedValue: string | null;
  publishedAt: string | null;
  openingAt: string | null;
  sourceUrl: string | null;
  status: OpportunityStatus;
  priority: Priority;
  favorite: boolean;
  score: number | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityFilters {
  status?: OpportunityStatus;
  priority?: Priority;
  state?: string;
  agency?: string;
  favorite?: boolean;
  search?: string;
  minValue?: number;
  maxValue?: number;
  page?: number;
  limit?: number;
}
