import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { entity?: string; userId?: string; action?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.AuditLogWhereInput = {};
    if (filters.entity) where.entity = filters.entity;
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = { contains: filters.action };

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return paginatedResult(data.map((l) => serializeDates(l)), total, page, limit);
  }

  async log(params: {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    const log = await this.prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        userId: params.userId,
        metadata: params.metadata as Prisma.InputJsonValue,
        ipAddress: params.ipAddress,
      },
    });
    return serializeDates(log);
  }
}
