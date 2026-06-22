import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Priority, TenderStatus } from "@prisma/client";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateTenderDto, UpdateTenderDto } from "./dto/tender.dto";
import { TendersService } from "./tenders.service";

@Controller("tenders")
@UseGuards(JwtAuthGuard)
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Get()
  findAll(
    @Query("status") status?: TenderStatus,
    @Query("priority") priority?: Priority,
    @Query("agency") agency?: string,
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.tendersService.findAll({
      status,
      priority,
      agency,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tendersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTenderDto) {
    return this.tendersService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTenderDto) {
    return this.tendersService.update(id, dto);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: TenderStatus) {
    return this.tendersService.updateStatus(id, status);
  }
}
