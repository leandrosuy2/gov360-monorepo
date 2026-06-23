import { Injectable, NotFoundException } from "@nestjs/common";
import { DocumentCategory, DocumentStatus, Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { computeDocumentStatus, paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto/document.dto";

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    category?: DocumentCategory;
    status?: DocumentStatus;
    search?: string;
    certificatesOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.DocumentWhereInput = {};

    if (filters.certificatesOnly) where.category = "CERTIDAO";
    else if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [{ name: { contains: filters.search } }, { fileName: { contains: filters.search } }];
    }

    const [data, total] = await Promise.all([
      this.prisma.document.findMany({ where, skip, take: limit, orderBy: { expiresAt: "asc" } }),
      this.prisma.document.count({ where }),
    ]);

    return paginatedResult(data.map((d) => serializeDates(d)), total, page, limit);
  }

  async getStats() {
    const [valid, expiring, expired, total] = await Promise.all([
      this.prisma.document.count({ where: { status: "VALID", category: "CERTIDAO" } }),
      this.prisma.document.count({ where: { status: "EXPIRING", category: "CERTIDAO" } }),
      this.prisma.document.count({ where: { status: "EXPIRED", category: "CERTIDAO" } }),
      this.prisma.document.count({ where: { category: "CERTIDAO" } }),
    ]);
    return { valid, expiring, expired, total };
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: "desc" } } },
    });
    if (!doc) throw new NotFoundException("Documento não encontrado");
    return serializeDates(doc);
  }

  async create(dto: CreateDocumentDto) {
    const status = dto.expiresAt ? computeDocumentStatus(new Date(dto.expiresAt)) : "PENDING_REVIEW";
    const { category, ...rest } = dto;
    const data: Prisma.DocumentCreateInput = {
      ...rest,
      category: category as any,
      status,
      issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    };
    const doc = await this.prisma.document.create({ data });
    return serializeDates(doc);
  }

  async update(id: string, dto: UpdateDocumentDto) {
    await this.findOne(id);
    const { category, tenderId, ...rest } = dto;
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    const status = expiresAt ? computeDocumentStatus(expiresAt) : undefined;
    const data: Prisma.DocumentUpdateInput = {
      ...rest,
      ...(category ? { category: category as any } : {}),
      expiresAt,
      status,
      issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
    };
    const doc = await this.prisma.document.update({
      where: { id },
      data,
    });
    return serializeDates(doc);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.document.delete({ where: { id } });
    return { success: true };
  }
}
