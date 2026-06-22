import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, OpportunityStatus, Priority } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateOpportunityDto, UpdateOpportunityDto } from "./dto/opportunity.dto";

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    status?: OpportunityStatus;
    priority?: Priority;
    state?: string;
    states?: string[];
    city?: string;
    region?: string;
    agency?: string;
    modality?: string;
    source?: string;
    segment?: string;
    cnae?: string;
    negativeKeywords?: string[];
    openingFrom?: Date;
    openingTo?: Date;
    publishedFrom?: Date;
    publishedTo?: Date;
    favorite?: boolean;
    search?: string;
    minValue?: number;
    maxValue?: number;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.OpportunityWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    const regionStates: Record<string, string[]> = {
      NORTE: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
      NORDESTE: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
      CENTRO_OESTE: ["DF", "GO", "MT", "MS"],
      SUDESTE: ["ES", "MG", "RJ", "SP"],
      SUL: ["PR", "RS", "SC"],
    };
    const selectedStates = filters.states?.length ? filters.states : filters.region ? regionStates[filters.region] : undefined;
    if (selectedStates?.length) where.state = { in: selectedStates };
    else if (filters.state) where.state = filters.state;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.agency) where.agency = { contains: filters.agency };
    if (filters.modality) where.modality = { contains: filters.modality };
    if (filters.source) where.source = filters.source;
    if (filters.cnae) where.cnaes = { array_contains: filters.cnae };
    if (filters.favorite !== undefined) where.favorite = filters.favorite;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { object: { contains: filters.search } },
        { agency: { contains: filters.search } },
      ];
    }
    const additionalConditions: Prisma.OpportunityWhereInput[] = [];
    if (filters.segment) additionalConditions.push({ OR: [{ title: { contains: filters.segment } }, { object: { contains: filters.segment } }] });
    if (filters.negativeKeywords?.length) {
      additionalConditions.push(...filters.negativeKeywords.map((keyword) => ({
        NOT: { OR: [{ title: { contains: keyword } }, { object: { contains: keyword } }] },
      })));
    }
    if (additionalConditions.length) where.AND = additionalConditions;
    if (filters.minValue || filters.maxValue) {
      where.estimatedValue = {};
      if (filters.minValue) where.estimatedValue.gte = filters.minValue;
      if (filters.maxValue) where.estimatedValue.lte = filters.maxValue;
    }
    if (filters.openingFrom || filters.openingTo) {
      where.openingAt = {};
      if (filters.openingFrom) where.openingAt.gte = filters.openingFrom;
      if (filters.openingTo) where.openingAt.lte = filters.openingTo;
    }
    if (filters.publishedFrom || filters.publishedTo) {
      where.publishedAt = {};
      if (filters.publishedFrom) where.publishedAt.gte = filters.publishedFrom;
      if (filters.publishedTo) where.publishedAt.lte = filters.publishedTo;
    }

    const [data, total, stateGroups, valueAggregate] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { openingAt: "desc" },
        include: { assignee: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.opportunity.count({ where }),
      this.prisma.opportunity.groupBy({ by: ["state"], where, _count: { _all: true }, _sum: { estimatedValue: true } }),
      this.prisma.opportunity.aggregate({ where, _sum: { estimatedValue: true }, _avg: { score: true } }),
    ]);

    return {
      data: data.map((o) => this.serialize(o)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      facets: {
        totalValue: valueAggregate._sum.estimatedValue?.toString() ?? "0",
        averageScore: valueAggregate._avg.score ?? 0,
        byState: stateGroups.filter((group) => group.state).map((group) => ({ state: group.state, count: group._count._all, value: group._sum.estimatedValue?.toString() ?? "0" })),
      },
    };
  }

  async findOne(id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    if (!opportunity) {
      throw new NotFoundException("Oportunidade não encontrada");
    }

    return this.serialize(opportunity);
  }

  async create(dto: CreateOpportunityDto) {
    const opportunity = await this.prisma.opportunity.create({ data: dto });
    return this.serialize(opportunity);
  }

  async update(id: string, dto: UpdateOpportunityDto) {
    await this.findOne(id);
    const opportunity = await this.prisma.opportunity.update({ where: { id }, data: dto });
    return this.serialize(opportunity);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.opportunity.delete({ where: { id } });
    return { success: true };
  }

  private serialize(opportunity: {
    id: string;
    externalId: string | null;
    title: string;
    object: string;
    agency: string;
    source: string;
    modality: string | null;
    state: string | null;
    city: string | null;
    estimatedValue: Prisma.Decimal | null;
    publishedAt: Date | null;
    openingAt: Date | null;
    sourceUrl: string | null;
    status: OpportunityStatus;
    priority: Priority;
    favorite: boolean;
    score: number | null;
    assigneeId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const daysToOpening = opportunity.openingAt ? Math.ceil((opportunity.openingAt.getTime() - Date.now()) / 86400000) : 30;
    const derivedScore = Math.max(10, Math.min(100, 55 + (opportunity.favorite ? 15 : 0) + (opportunity.estimatedValue && opportunity.estimatedValue.toNumber() >= 100000 ? 10 : 0) + (daysToOpening >= 3 && daysToOpening <= 30 ? 15 : 0)));
    return {
      ...opportunity,
      estimatedValue: opportunity.estimatedValue?.toString() ?? null,
      score: opportunity.score ?? derivedScore,
      publishedAt: opportunity.publishedAt?.toISOString() ?? null,
      openingAt: opportunity.openingAt?.toISOString() ?? null,
      createdAt: opportunity.createdAt.toISOString(),
      updatedAt: opportunity.updatedAt.toISOString(),
    };
  }
}
