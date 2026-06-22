import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProposalStatus } from "@prisma/client";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateProposalDto, UpdateProposalDto } from "./dto/proposal.dto";
import { ProposalsService } from "./proposals.service";

@Controller("proposals")
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  findAll(
    @Query("tenderId") tenderId?: string,
    @Query("status") status?: ProposalStatus,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.proposalsService.findAll({
      tenderId,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.proposalsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProposalDto) {
    return this.proposalsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateProposalDto) {
    return this.proposalsService.update(id, dto);
  }
}
