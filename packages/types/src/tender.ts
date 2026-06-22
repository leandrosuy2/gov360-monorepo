export type TenderStatus =
  | "NEW"
  | "ANALYZING"
  | "APPROVED"
  | "REJECTED"
  | "DOCUMENTATION_PENDING"
  | "PROPOSAL"
  | "PARTICIPATING"
  | "DISPUTE"
  | "QUALIFICATION"
  | "APPEAL"
  | "AWARDED"
  | "LOST"
  | "CONTRACTED"
  | "CLOSED";

import type { Priority } from "./common";

export interface Tender {
  id: string;
  noticeNumber: string;
  processNumber: string | null;
  modality: string;
  object: string;
  agency: string;
  source: string;
  estimatedValue: string | null;
  openingAt: string | null;
  proposalDueAt: string | null;
  status: TenderStatus;
  priority: Priority;
  notes: string | null;
  opportunityId: string | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenderFilters {
  status?: TenderStatus;
  priority?: Priority;
  agency?: string;
  search?: string;
  page?: number;
  limit?: number;
}
