import { Injectable, NotFoundException } from "@nestjs/common";
import { FinancialStatus, Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateFinancialDto, UpdateFinancialDto } from "./dto/financial.dto";

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { contractId?: string; status?: FinancialStatus; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.FinancialRecordWhereInput = {};
    if (filters.contractId) where.contractId = filters.contractId;
    if (filters.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueDate: "asc" },
        include: { contract: { select: { contractNumber: true, agency: true } } },
      }),
      this.prisma.financialRecord.count({ where }),
    ]);

    return paginatedResult(data.map((f) => serializeDates(f)), total, page, limit);
  }

  async getSummary() {
    const records = await this.prisma.financialRecord.findMany({ select: { amount: true, status: true } });
    let received = 0;
    let pending = 0;
    let overdue = 0;
    const now = new Date();

    for (const r of records) {
      const val = Number(r.amount);
      if (r.status === "RECEIVED") received += val;
      else if (r.status === "OVERDUE") overdue += val;
      else pending += val;
    }

    const byAgency = await this.prisma.financialRecord.findMany({
      include: { contract: { select: { agency: true } } },
    });

    const agencyMap = new Map<string, number>();
    for (const r of byAgency) {
      if (r.status === "RECEIVED") {
        const agency = r.contract.agency;
        agencyMap.set(agency, (agencyMap.get(agency) ?? 0) + Number(r.amount));
      }
    }

    return {
      received: received.toFixed(2),
      pending: pending.toFixed(2),
      overdue: overdue.toFixed(2),
      revenueByAgency: Array.from(agencyMap.entries())
        .map(([agency, value]) => ({ agency, value: value.toFixed(2) }))
        .sort((a, b) => Number(b.value) - Number(a.value))
        .slice(0, 10),
    };
  }

  async create(dto: CreateFinancialDto) {
    const record = await this.prisma.financialRecord.create({
      data: {
        ...dto,
        referenceDate: dto.referenceDate ? new Date(dto.referenceDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
    return serializeDates(record);
  }

  async update(id: string, dto: UpdateFinancialDto) {
    const existing = await this.prisma.financialRecord.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Registro financeiro não encontrado");
    const record = await this.prisma.financialRecord.update({
      where: { id },
      data: {
        ...dto,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        status: dto.status,
      },
    });
    return serializeDates(record);
  }
}
