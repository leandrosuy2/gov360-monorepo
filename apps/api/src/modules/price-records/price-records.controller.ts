import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import {
  CreatePriceRecordCaronaDto,
  CreatePriceRecordDto,
  CreatePriceRecordItemDto,
  UpdatePriceRecordDto,
  UpdatePriceRecordItemDto,
} from "./dto/price-record.dto";
import { PriceRecordsService } from "./price-records.service";

@Controller("price-records")
@UseGuards(JwtAuthGuard)
export class PriceRecordsController {
  constructor(private readonly priceRecordsService: PriceRecordsService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("active") active?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.priceRecordsService.findAll({
      search,
      active: active === "true",
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.priceRecordsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePriceRecordDto) {
    return this.priceRecordsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePriceRecordDto) {
    return this.priceRecordsService.update(id, dto);
  }

  @Post(":id/items")
  addItem(@Param("id") id: string, @Body() dto: CreatePriceRecordItemDto) {
    return this.priceRecordsService.addItem(id, dto);
  }

  @Patch(":id/items/:itemId")
  updateItem(
    @Param("id") id: string,
    @Param("itemId") itemId: string,
    @Body() dto: UpdatePriceRecordItemDto,
  ) {
    return this.priceRecordsService.updateItem(id, itemId, dto);
  }

  @Post(":id/caronas")
  addCarona(@Param("id") id: string, @Body() dto: CreatePriceRecordCaronaDto) {
    return this.priceRecordsService.addCarona(id, dto);
  }
}
