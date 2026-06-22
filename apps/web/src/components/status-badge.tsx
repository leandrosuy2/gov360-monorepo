"use client";

import { Badge } from "@gov360/ui";
import { OPPORTUNITY_STATUS_LABELS, PRIORITY_LABELS, TENDER_STATUS_LABELS } from "@/config/navigation";

const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  VALID: "Válido",
  EXPIRING: "Vencendo",
  EXPIRED: "Vencido",
  PENDING_REVIEW: "Pendente",
};

export function StatusBadge({ status, type = "opportunity" }: { status: string; type?: "opportunity" | "tender" | "document" }) {
  const labels =
    type === "tender" ? TENDER_STATUS_LABELS
    : type === "document" ? DOCUMENT_STATUS_LABELS
    : OPPORTUNITY_STATUS_LABELS;
  const label = labels[status] ?? status;

  const variant =
    status === "AWARDED" || status === "APPROVED" || status === "VALID" ? "success"
    : status === "LOST" || status === "REJECTED" || status === "EXPIRED" ? "danger"
    : status === "EXPIRING" || status === "DISPUTE" || status === "URGENT" ? "warning"
    : "secondary";

  return <Badge variant={variant}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const variant =
    priority === "URGENT" ? "danger"
    : priority === "HIGH" ? "warning"
    : "secondary";
  return <Badge variant={variant}>{PRIORITY_LABELS[priority] ?? priority}</Badge>;
}
