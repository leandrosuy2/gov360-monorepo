import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { FinancialStatus } from "@prisma/client";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateFinancialDto, UpdateFinancialDto } from "./dto/financial.dto";
import { FinancialService } from "./financial.service";

@Controller("financial")
@UseGuards(JwtAuthGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get()
  findAll(
    @Query("contractId") contractId?: string,
    @Query("status") status?: FinancialStatus,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.financialService.findAll({
      contractId,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get("summary")
  getSummary() {
    return this.financialService.getSummary();
  }

  @Post()
  create(@Body() dto: CreateFinancialDto) {
    return this.financialService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFinancialDto) {
    return this.financialService.update(id, dto);
  }
}
