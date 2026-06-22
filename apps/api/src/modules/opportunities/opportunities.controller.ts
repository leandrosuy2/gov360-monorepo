import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { OpportunityStatus, Priority } from "@prisma/client";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateOpportunityDto, UpdateOpportunityDto } from "./dto/opportunity.dto";
import { OpportunitiesService } from "./opportunities.service";

@Controller("opportunities")
@UseGuards(JwtAuthGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  findAll(
    @Query("status") status?: OpportunityStatus,
    @Query("priority") priority?: Priority,
    @Query("state") state?: string,
    @Query("states") states?: string,
    @Query("city") city?: string,
    @Query("region") region?: string,
    @Query("agency") agency?: string,
    @Query("modality") modality?: string,
    @Query("source") source?: string,
    @Query("segment") segment?: string,
    @Query("cnae") cnae?: string,
    @Query("negativeKeywords") negativeKeywords?: string,
    @Query("openingFrom") openingFrom?: string,
    @Query("openingTo") openingTo?: string,
    @Query("publishedFrom") publishedFrom?: string,
    @Query("publishedTo") publishedTo?: string,
    @Query("favorite") favorite?: string,
    @Query("search") search?: string,
    @Query("minValue") minValue?: string,
    @Query("maxValue") maxValue?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.opportunitiesService.findAll({
      status,
      priority,
      state,
      states: states?.split(",").map((value) => value.trim()).filter(Boolean),
      city,
      region,
      agency,
      modality,
      source,
      segment,
      cnae,
      negativeKeywords: negativeKeywords?.split(",").map((value) => value.trim()).filter(Boolean),
      openingFrom: openingFrom ? new Date(`${openingFrom}T00:00:00`) : undefined,
      openingTo: openingTo ? new Date(`${openingTo}T23:59:59`) : undefined,
      publishedFrom: publishedFrom ? new Date(`${publishedFrom}T00:00:00`) : undefined,
      publishedTo: publishedTo ? new Date(`${publishedTo}T23:59:59`) : undefined,
      favorite: favorite === "true" ? true : favorite === "false" ? false : undefined,
      search,
      minValue: minValue ? Number(minValue) : undefined,
      maxValue: maxValue ? Number(maxValue) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.opportunitiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOpportunityDto) {
    return this.opportunitiesService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateOpportunityDto) {
    return this.opportunitiesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.opportunitiesService.remove(id);
  }
}
