// Local enum definitions mirroring Prisma enums to avoid import issues
export enum AuctionStatus {
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
}

export enum BidStrategy {
  AGGRESSIVE = "AGGRESSIVE",
  MODERATE = "MODERATE",
  CONSERVATIVE = "CONSERVATIVE",
}

import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuctionDto {
  @IsString()
  tenderId!: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @IsOptional()
  @IsEnum(BidStrategy)
  strategy?: BidStrategy;

  @IsOptional()
  @IsNumber()
  minBid?: number;

  @IsOptional()
  @IsNumber()
  maxBid?: number;

  @IsOptional()
  @IsNumber()
  minMargin?: number;

  @IsOptional()
  @IsBoolean()
  autoBid?: boolean;
}

export class UpdateAuctionDto {
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @IsOptional()
  @IsEnum(BidStrategy)
  strategy?: BidStrategy;

  @IsOptional()
  @IsBoolean()
  autoBid?: boolean;
}

export class CreateBidDto {
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsBoolean()
  isAuto?: boolean;
}

export class CreateAuctionMessageDto {
  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsBoolean()
  isFromUs?: boolean;
}
