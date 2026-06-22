import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreatePriceRecordCaronaDto,
  CreatePriceRecordDto,
  CreatePriceRecordItemDto,
  UpdatePriceRecordDto,
  UpdatePriceRecordItemDto,
} from "./dto/price-record.dto";

@Injectable()
export class PriceRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { search?: string; active?: boolean; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.PriceRecordWhereInput = {};
    if (filters.search) {
      where.OR = [
        { ataNumber: { contains: filters.search } },
        { contract: { agency: { contains: filters.search } } },
        { contract: { object: { contains: filters.search } } },
      ];
    }
    if (filters.active) where.endsAt = { gte: new Date() };

    const [data, total] = await Promise.all([
      this.prisma.priceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ endsAt: "asc" }, { createdAt: "desc" }],
        include: {
          contract: { select: { id: true, contractNumber: true, agency: true, object: true } },
          items: { orderBy: { itemNumber: "asc" } },
          caronas: { orderBy: { requestedAt: "desc" } },
        },
      }),
      this.prisma.priceRecord.count({ where }),
    ]);
    return paginatedResult(data.map((record) => serializeDates(record)), total, page, limit);
  }

  async findOne(id: string) {
    const record = await this.prisma.priceRecord.findUnique({
      where: { id },
      include: { contract: true, items: true, caronas: true },
    });
    if (!record) throw new NotFoundException("Ata não encontrada");
    return serializeDates(record);
  }

  async create(dto: CreatePriceRecordDto) {
    const contract = await this.prisma.contract.findUnique({ where: { id: dto.contractId } });
    if (!contract) throw new NotFoundException("Contrato não encontrado");
    const record = await this.prisma.priceRecord.create({
      data: {
        contractId: dto.contractId,
        ataNumber: dto.ataNumber,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
      include: { contract: true, items: true, caronas: true },
    });
    return serializeDates(record);
  }

  async update(id: string, dto: UpdatePriceRecordDto) {
    await this.findOne(id);
    const record = await this.prisma.priceRecord.update({
      where: { id },
      data: {
        ...dto,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
      include: { contract: true, items: true, caronas: true },
    });
    return serializeDates(record);
  }

  async addItem(priceRecordId: string, dto: CreatePriceRecordItemDto) {
    await this.findOne(priceRecordId);
    const item = await this.prisma.priceRecordItem.create({ data: { priceRecordId, ...dto } });
    return serializeDates(item);
  }

  async updateItem(priceRecordId: string, itemId: string, dto: UpdatePriceRecordItemDto) {
    const item = await this.prisma.priceRecordItem.findFirst({ where: { id: itemId, priceRecordId } });
    if (!item) throw new NotFoundException("Item da ata não encontrado");
    return serializeDates(await this.prisma.priceRecordItem.update({ where: { id: itemId }, data: dto }));
  }

  async addCarona(priceRecordId: string, dto: CreatePriceRecordCaronaDto) {
    await this.findOne(priceRecordId);
    const carona = await this.prisma.priceRecordCarona.create({
      data: {
        priceRecordId,
        agency: dto.agency,
        object: dto.object,
        value: dto.value,
        requestedAt: dto.requestedAt ? new Date(dto.requestedAt) : undefined,
      },
    });
    return serializeDates(carona);
  }
}
