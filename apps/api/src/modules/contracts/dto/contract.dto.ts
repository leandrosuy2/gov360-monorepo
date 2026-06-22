import type { ContractStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateContractDto {
  @IsString()
  contractNumber!: string;

  @IsString()
  agency!: string;

  @IsString()
  object!: string;

  @IsOptional()
  @IsNumber()
  totalValue?: number;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  signedAt?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsString()
  tenderId?: string;
}

export class UpdateContractDto {
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
