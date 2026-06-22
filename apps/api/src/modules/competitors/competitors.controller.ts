import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateCompetitorDto, CreateCompetitorWinDto } from "./dto/competitor.dto";
import { CompetitorsService } from "./competitors.service";

@Controller("competitors")
@UseGuards(JwtAuthGuard)
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  @Get()
  findAll(@Query("search") search?: string, @Query("page") page?: string, @Query("limit") limit?: string) {
    return this.competitorsService.findAll({
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get("ranking")
  getRanking() {
    return this.competitorsService.getRanking();
  }

  @Get("market-stats")
  getMarketStats() {
    return this.competitorsService.getMarketStats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.competitorsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCompetitorDto) {
    return this.competitorsService.create(dto);
  }

  @Post(":id/wins")
  addWin(@Param("id") id: string, @Body() dto: CreateCompetitorWinDto) {
    return this.competitorsService.addWin(id, dto);
  }
}
