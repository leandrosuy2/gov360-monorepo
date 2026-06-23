import { Injectable, NotFoundException } from "@nestjs/common";
import { ContractStatus, Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateContractDto, UpdateContractDto } from "./dto/contract.dto";

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { status?: ContractStatus; agency?: string; search?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.ContractWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.agency) where.agency = { contains: filters.agency };
    if (filters.search) {
      where.OR = [{ contractNumber: { contains: filters.search } }, { object: { contains: filters.search } }];
    }

    const [data, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { endsAt: "asc" },
        include: { _count: { select: { addendums: true, guarantees: true, financials: true } } },
      }),
      this.prisma.contract.count({ where }),
    ]);

    return paginatedResult(data.map((c) => serializeDates(c)), total, page, limit);
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { addendums: true, guarantees: true, financials: true, priceRecord: { include: { items: true } } },
    });
    if (!contract) throw new NotFoundException("Contrato não encontrado");
    return serializeDates(contract);
  }

  async create(dto: CreateContractDto) {
    const { status, ...rest } = dto;
    const data: Prisma.ContractCreateInput = {
      ...rest,
      signedAt: dto.signedAt ? new Date(dto.signedAt) : undefined,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
    };
    if (status) {
      // Cast string to ContractStatus enum; assume validation ensures correct values
      (data as any).status = status as any;
    }
    const contract = await this.prisma.contract.create({ data });
    return serializeDates(contract);
  }

  async update(id: string, dto: UpdateContractDto) {
    await this.findOne(id);
    const { status, ...rest } = dto;
    const data: Prisma.ContractUpdateInput = {
      ...rest,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
    };
    if (status) {
      (data as any).status = status as any;
    }
    const contract = await this.prisma.contract.update({ where: { id }, data });
    return serializeDates(contract);
  }
}
