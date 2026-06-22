import { Injectable } from "@nestjs/common";
import { ContractStatus, DocumentStatus, FinancialStatus, TaskStatus, TenderStatus } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      oppTotal,
      oppNew,
      oppAnalyzing,
      oppFavorited,
      tenderTotal,
      tenderParticipating,
      tenderAwarded,
      tenderLost,
      tenderActive,
      docTotal,
      docValid,
      docExpiring,
      docExpired,
      contractTotal,
      contractActive,
      contractExpiring,
      taskTotal,
      taskPending,
      taskOverdue,
      financialRecords,
      opportunityValue,
      opportunityByState,
      opportunityByAgency,
      opportunityByModality,
      recentOpportunities,
      recentTenders,
      expiringDocuments,
    ] = await Promise.all([
      this.prisma.opportunity.count(),
      this.prisma.opportunity.count({ where: { status: "NEW" } }),
      this.prisma.opportunity.count({ where: { status: "ANALYZING" } }),
      this.prisma.opportunity.count({ where: { favorite: true } }),
      this.prisma.tender.count(),
      this.prisma.tender.count({ where: { status: "PARTICIPATING" } }),
      this.prisma.tender.count({ where: { status: "AWARDED" } }),
      this.prisma.tender.count({ where: { status: "LOST" } }),
      this.prisma.tender.count({
        where: {
          status: {
            in: [
              TenderStatus.ANALYZING,
              TenderStatus.PROPOSAL,
              TenderStatus.PARTICIPATING,
              TenderStatus.DISPUTE,
              TenderStatus.QUALIFICATION,
            ],
          },
        },
      }),
      this.prisma.document.count(),
      this.prisma.document.count({ where: { status: DocumentStatus.VALID } }),
      this.prisma.document.count({ where: { status: DocumentStatus.EXPIRING } }),
      this.prisma.document.count({ where: { status: DocumentStatus.EXPIRED } }),
      this.prisma.contract.count(),
      this.prisma.contract.count({ where: { status: ContractStatus.ACTIVE } }),
      this.prisma.contract.count({
        where: { status: ContractStatus.ACTIVE, endsAt: { lte: in30Days, gte: now } },
      }),
      this.prisma.task.count(),
      this.prisma.task.count({
        where: { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED] } },
      }),
      this.prisma.task.count({
        where: {
          status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
          dueAt: { lt: now },
        },
      }),
      this.prisma.financialRecord.findMany({
        select: { amount: true, status: true },
      }),
      this.prisma.opportunity.aggregate({ _sum: { estimatedValue: true } }),
      this.prisma.opportunity.groupBy({
        by: ["state"],
        where: { state: { not: null } },
        _count: { id: true },
        _sum: { estimatedValue: true },
        orderBy: { _count: { id: "desc" } },
        take: 8,
      }),
      this.prisma.opportunity.groupBy({
        by: ["agency"],
        _count: { id: true },
        _sum: { estimatedValue: true },
        orderBy: { _count: { id: "desc" } },
        take: 8,
      }),
      this.prisma.opportunity.groupBy({
        by: ["modality"],
        where: { modality: { not: null } },
        _count: { id: true },
        _sum: { estimatedValue: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
      this.prisma.opportunity.findMany({
        orderBy: [{ openingAt: "asc" }, { createdAt: "desc" }],
        take: 6,
        select: { id: true, object: true, agency: true, state: true, estimatedValue: true, openingAt: true, source: true, score: true, status: true },
      }),
      this.prisma.tender.findMany({
        orderBy: [{ openingAt: "asc" }, { createdAt: "desc" }],
        take: 6,
        select: { id: true, noticeNumber: true, object: true, agency: true, estimatedValue: true, openingAt: true, status: true, priority: true },
      }),
      this.prisma.document.findMany({
        where: { expiresAt: { gte: now } },
        orderBy: { expiresAt: "asc" },
        take: 6,
        select: { id: true, name: true, category: true, status: true, expiresAt: true },
      }),
    ]);

    let totalContracted = 0;
    let totalReceived = 0;
    let totalPending = 0;

    for (const record of financialRecords) {
      const amount = Number(record.amount);
      if (record.status === FinancialStatus.RECEIVED) {
        totalReceived += amount;
      } else if (record.status === FinancialStatus.PENDING || record.status === FinancialStatus.INVOICED) {
        totalPending += amount;
      }
      totalContracted += amount;
    }

    return {
      opportunities: {
        total: oppTotal,
        new: oppNew,
        analyzing: oppAnalyzing,
        favorited: oppFavorited,
        estimatedValue: opportunityValue._sum.estimatedValue?.toString() ?? "0",
      },
      tenders: {
        total: tenderTotal,
        active: tenderActive,
        participating: tenderParticipating,
        awarded: tenderAwarded,
        lost: tenderLost,
      },
      documents: {
        total: docTotal,
        valid: docValid,
        expiring: docExpiring,
        expired: docExpired,
      },
      contracts: {
        total: contractTotal,
        active: contractActive,
        expiringSoon: contractExpiring,
      },
      tasks: {
        total: taskTotal,
        pending: taskPending,
        overdue: taskOverdue,
      },
      financial: {
        totalContracted: totalContracted.toFixed(2),
        totalReceived: totalReceived.toFixed(2),
        totalPending: totalPending.toFixed(2),
      },
      intelligence: {
        opportunitiesByState: opportunityByState.map((item) => ({
          state: item.state,
          count: item._count.id,
          totalValue: item._sum.estimatedValue?.toString() ?? "0",
        })),
        topAgencies: opportunityByAgency.map((item) => ({
          agency: item.agency,
          count: item._count.id,
          totalValue: item._sum.estimatedValue?.toString() ?? "0",
        })),
        modalities: opportunityByModality.map((item) => ({
          modality: item.modality,
          count: item._count.id,
          totalValue: item._sum.estimatedValue?.toString() ?? "0",
        })),
      },
      recent: {
        opportunities: recentOpportunities.map((item) => ({
          ...item,
          estimatedValue: item.estimatedValue?.toString() ?? null,
          openingAt: item.openingAt?.toISOString() ?? null,
        })),
        tenders: recentTenders.map((item) => ({
          ...item,
          estimatedValue: item.estimatedValue?.toString() ?? null,
          openingAt: item.openingAt?.toISOString() ?? null,
        })),
        expiringDocuments: expiringDocuments.map((item) => ({
          ...item,
          expiresAt: item.expiresAt?.toISOString() ?? null,
        })),
      },
    };
  }
}
