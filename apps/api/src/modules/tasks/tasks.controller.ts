import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Priority, TaskStatus } from "@prisma/client";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { AddCommentDto, CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { TasksService } from "./tasks.service";

@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query("status") status?: TaskStatus,
    @Query("priority") priority?: Priority,
    @Query("assigneeId") assigneeId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.tasksService.findAll({
      status,
      priority,
      assigneeId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: { id: string }) {
    return this.tasksService.create(dto, user.id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Post(":id/comments")
  addComment(@Param("id") id: string, @Body() dto: AddCommentDto, @CurrentUser() user: { id: string }) {
    return this.tasksService.addComment(id, user.id, dto.content);
  }
}
