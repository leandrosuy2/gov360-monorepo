import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateCompetitorDto, CreateCompetitorWinDto } from "./dto/competitor.dto";

@Injectable()
export class CompetitorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { search?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.CompetitorWhereInput = {};
    if (filters.search) {
      where.OR = [{ name: { contains: filters.search } }, { cnpj: { contains: filters.search } }];
    }

    const [data, total] = await Promise.all([
      this.prisma.competitor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: { _count: { select: { wins: true } } },
      }),
      this.prisma.competitor.count({ where }),
    ]);

    return paginatedResult(data.map((c) => serializeDates(c)), total, page, limit);
  }

  async getRanking() {
    const competitors = await this.prisma.competitor.findMany({
      include: { _count: { select: { wins: true } }, wins: { orderBy: { wonAt: "desc" }, take: 1 } },
      orderBy: { wins: { _count: "desc" } },
      take: 20,
    });
    return competitors.map((c) => ({
      id: c.id,
      name: c.name,
      cnpj: c.cnpj,
      winCount: c._count.wins,
      lastWin: c.wins[0] ? serializeDates(c.wins[0]) : null,
    }));
  }

  async getMarketStats() {
    const [topAgencies, totalWins, totalValue, opportunityValue, opportunitiesByAgency, opportunitiesByState, opportunitiesByModality, recentOpportunities] = await Promise.all([
      this.prisma.competitorWin.groupBy({
        by: ["agency"],
        _count: { id: true },
        _sum: { value: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      this.prisma.competitorWin.count(),
      this.prisma.competitorWin.aggregate({ _sum: { value: true } }),
      this.prisma.opportunity.aggregate({ _sum: { estimatedValue: true }, _count: { id: true } }),
      this.prisma.opportunity.groupBy({
        by: ["agency"],
        _count: { id: true },
        _sum: { estimatedValue: true },
        orderBy: { _count: { id: "desc" } },
        take: 12,
      }),
      this.prisma.opportunity.groupBy({
        by: ["state"],
        where: { state: { not: null } },
        _count: { id: true },
        _sum: { estimatedValue: true },
        orderBy: { _count: { id: "desc" } },
        take: 12,
      }),
      this.prisma.opportunity.groupBy({
        by: ["modality"],
        where: { modality: { not: null } },
        _count: { id: true },
        _sum: { estimatedValue: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      this.prisma.opportunity.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 8,
        select: { id: true, object: true, agency: true, state: true, modality: true, source: true, estimatedValue: true, publishedAt: true, openingAt: true, score: true },
      }),
    ]);

    return {
      topAgencies: topAgencies.map((a) => ({
        agency: a.agency,
        count: a._count.id,
        totalValue: a._sum.value?.toString() ?? "0",
      })),
      totalWins,
      totalHomologatedValue: totalValue._sum.value?.toString() ?? "0",
      opportunityMarket: {
        totalOpportunities: opportunityValue._count.id,
        totalEstimatedValue: opportunityValue._sum.estimatedValue?.toString() ?? "0",
        topAgencies: opportunitiesByAgency.map((item) => ({
          agency: item.agency,
          count: item._count.id,
          totalValue: item._sum.estimatedValue?.toString() ?? "0",
        })),
        byState: opportunitiesByState.map((item) => ({
          state: item.state,
          count: item._count.id,
          totalValue: item._sum.estimatedValue?.toString() ?? "0",
        })),
        byModality: opportunitiesByModality.map((item) => ({
          modality: item.modality,
          count: item._count.id,
          totalValue: item._sum.estimatedValue?.toString() ?? "0",
        })),
        recentOpportunities: recentOpportunities.map((item) => ({
          ...item,
          estimatedValue: item.estimatedValue?.toString() ?? null,
          publishedAt: item.publishedAt?.toISOString() ?? null,
          openingAt: item.openingAt?.toISOString() ?? null,
        })),
      },
    };
  }

  async findOne(id: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
      include: { wins: { orderBy: { wonAt: "desc" } } },
    });
    if (!competitor) throw new NotFoundException("Concorrente não encontrado");
    return serializeDates(competitor);
  }

  async create(dto: CreateCompetitorDto) {
    const competitor = await this.prisma.competitor.create({ data: dto });
    return serializeDates(competitor);
  }

  async addWin(competitorId: string, dto: CreateCompetitorWinDto) {
    await this.findOne(competitorId);
    const win = await this.prisma.competitorWin.create({
      data: {
        competitorId,
        agency: dto.agency,
        object: dto.object,
        modality: dto.modality,
        value: dto.value,
        wonAt: dto.wonAt ? new Date(dto.wonAt) : undefined,
        source: dto.source,
      },
    });
    return serializeDates(win);
  }
}
