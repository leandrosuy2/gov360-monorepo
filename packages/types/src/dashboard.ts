export interface DashboardStats {
  opportunities: {
    total: number;
    new: number;
    analyzing: number;
    favorited: number;
    estimatedValue?: string;
  };
  tenders: {
    total: number;
    active: number;
    participating: number;
    awarded: number;
    lost: number;
  };
  documents: {
    total: number;
    valid: number;
    expiring: number;
    expired: number;
  };
  contracts: {
    total: number;
    active: number;
    expiringSoon: number;
  };
  tasks: {
    total: number;
    pending: number;
    overdue: number;
  };
  financial: {
    totalContracted: string;
    totalReceived: string;
    totalPending: string;
  };
  intelligence?: {
    opportunitiesByState: { state: string | null; count: number; totalValue: string }[];
    topAgencies: { agency: string; count: number; totalValue: string }[];
    modalities: { modality: string | null; count: number; totalValue: string }[];
  };
  recent?: {
    opportunities: {
      id: string;
      object: string;
      agency: string;
      state: string | null;
      estimatedValue: string | null;
      openingAt: string | null;
      source: string;
      score: number | null;
      status: string;
    }[];
    tenders: {
      id: string;
      noticeNumber: string;
      object: string;
      agency: string;
      estimatedValue: string | null;
      openingAt: string | null;
      status: string;
      priority: string;
    }[];
    expiringDocuments: {
      id: string;
      name: string;
      category: string;
      status: string;
      expiresAt: string | null;
    }[];
  };
}
