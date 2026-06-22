import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuctionStatus } from "@prisma/client";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateAuctionDto, CreateAuctionMessageDto, CreateBidDto, UpdateAuctionDto } from "./dto/auction.dto";
import { AuctionsService } from "./auctions.service";

@Controller("auctions")
@UseGuards(JwtAuthGuard)
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  findAll(@Query("status") status?: AuctionStatus, @Query("page") page?: string, @Query("limit") limit?: string) {
    return this.auctionsService.findAll({
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get("active")
  getActive() {
    return this.auctionsService.getActive();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auctionsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAuctionDto) {
    return this.auctionsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateAuctionDto) {
    return this.auctionsService.update(id, dto);
  }

  @Post(":id/bids")
  placeBid(@Param("id") id: string, @Body() dto: CreateBidDto) {
    return this.auctionsService.placeBid(id, dto);
  }

  @Get(":id/messages")
  getMessages(@Param("id") id: string) {
    return this.auctionsService.getMessages(id);
  }

  @Post(":id/messages")
  addMessage(@Param("id") id: string, @Body() dto: CreateAuctionMessageDto) {
    return this.auctionsService.addMessage(id, dto);
  }
}
