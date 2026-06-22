import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProposalStatus } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateProposalDto, UpdateProposalDto } from "./dto/proposal.dto";

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { tenderId?: string; status?: ProposalStatus; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.ProposalWhereInput = {};
    if (filters.tenderId) where.tenderId = filters.tenderId;
    if (filters.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { items: true } }, tender: { select: { noticeNumber: true, agency: true } } },
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return paginatedResult(data.map((p) => serializeDates(p)), total, page, limit);
  }

  async findOne(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { items: true, versions: { orderBy: { version: "desc" }, take: 5 }, tender: true },
    });
    if (!proposal) throw new NotFoundException("Proposta não encontrada");
    return serializeDates(proposal);
  }

  async create(dto: CreateProposalDto) {
    const { items, ...data } = dto;
    const proposal = await this.prisma.proposal.create({
      data: {
        ...data,
        items: items?.length ? { create: items } : undefined,
      },
      include: { items: true },
    });
    return serializeDates(proposal);
  }

  async update(id: string, dto: UpdateProposalDto) {
    await this.findOne(id);
    const proposal = await this.prisma.proposal.update({ where: { id }, data: dto });
    return serializeDates(proposal);
  }
}
