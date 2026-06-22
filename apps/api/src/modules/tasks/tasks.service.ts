import { Injectable, NotFoundException } from "@nestjs/common";
import { Priority, Prisma, TaskStatus } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { status?: TaskStatus; priority?: Priority; assigneeId?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.TaskWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueAt: "asc" },
        include: {
          assignee: { select: { id: true, name: true } },
          createdBy: { select: { id: true, name: true } },
          _count: { select: { comments: true, approvals: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return paginatedResult(data.map((t) => serializeDates(t)), total, page, limit);
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        comments: { orderBy: { createdAt: "desc" } },
        approvals: true,
      },
    });
    if (!task) throw new NotFoundException("Tarefa não encontrada");
    return serializeDates(task);
  }

  async create(dto: CreateTaskDto, createdById: string) {
    const task = await this.prisma.task.create({
      data: { ...dto, createdById, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined },
    });
    return serializeDates(task);
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    const task = await this.prisma.task.update({
      where: { id },
      data: { ...dto, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined },
    });
    return serializeDates(task);
  }

  async addComment(taskId: string, authorId: string, content: string) {
    await this.findOne(taskId);
    const comment = await this.prisma.taskComment.create({ data: { taskId, authorId, content } });
    return serializeDates(comment);
  }
}
