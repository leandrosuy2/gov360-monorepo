import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Priority, TenderStatus } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateTenderDto, UpdateTenderDto } from "./dto/tender.dto";

@Injectable()
export class TendersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    status?: TenderStatus;
    priority?: Priority;
    agency?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.TenderWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.agency) where.agency = { contains: filters.agency };
    if (filters.search) {
      where.OR = [
        { noticeNumber: { contains: filters.search } },
        { object: { contains: filters.search } },
        { agency: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.tender.findMany({
        where,
        skip,
        take: limit,
        orderBy: { openingAt: "desc" },
        include: { assignee: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.tender.count({ where }),
    ]);

    return {
      data: data.map((t) => this.serialize(t)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        opportunity: true,
        analysis: true,
      },
    });

    if (!tender) {
      throw new NotFoundException("Licitação não encontrada");
    }

    return this.serialize(tender);
  }

  async create(dto: CreateTenderDto) {
    const tender = await this.prisma.tender.create({ data: dto });
    return this.serialize(tender);
  }

  async update(id: string, dto: UpdateTenderDto) {
    await this.findOne(id);
    const tender = await this.prisma.tender.update({ where: { id }, data: dto });
    return this.serialize(tender);
  }

  async updateStatus(id: string, status: TenderStatus) {
    await this.findOne(id);
    const tender = await this.prisma.tender.update({ where: { id }, data: { status } });
    return this.serialize(tender);
  }

  private serialize(tender: {
    id: string;
    noticeNumber: string;
    processNumber: string | null;
    modality: string;
    object: string;
    agency: string;
    source: string;
    estimatedValue: Prisma.Decimal | null;
    openingAt: Date | null;
    proposalDueAt: Date | null;
    status: TenderStatus;
    priority: Priority;
    notes: string | null;
    opportunityId: string | null;
    assigneeId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...tender,
      estimatedValue: tender.estimatedValue?.toString() ?? null,
      openingAt: tender.openingAt?.toISOString() ?? null,
      proposalDueAt: tender.proposalDueAt?.toISOString() ?? null,
      createdAt: tender.createdAt.toISOString(),
      updatedAt: tender.updatedAt.toISOString(),
    };
  }
}
