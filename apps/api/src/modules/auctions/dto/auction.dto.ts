import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateAuctionDto {
  @IsString()
  tenderId!: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsEnum(Prisma.AuctionStatus)
  status?: Prisma.AuctionStatus;

  @IsOptional()
  @IsEnum(Prisma.BidStrategy)
  strategy?: Prisma.BidStrategy;

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
  @IsEnum(Prisma.AuctionStatus)
  status?: Prisma.AuctionStatus;

  @IsOptional()
  @IsEnum(Prisma.BidStrategy)
  strategy?: Prisma.BidStrategy;

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
