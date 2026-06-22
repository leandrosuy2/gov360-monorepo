import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePriceRecordDto {
  @IsString()
  contractId!: string;

  @IsString()
  ataNumber!: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}

export class UpdatePriceRecordDto {
  @IsOptional()
  @IsString()
  ataNumber?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}

export class CreatePriceRecordItemDto {
  @IsOptional()
  @IsString()
  itemNumber?: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  registeredQty?: number;

  @IsOptional()
  @IsNumber()
  balanceQty?: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}

export class UpdatePriceRecordItemDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  balanceQty?: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}

export class CreatePriceRecordCaronaDto {
  @IsString()
  agency!: string;

  @IsOptional()
  @IsString()
  object?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsDateString()
  requestedAt?: string;
}
