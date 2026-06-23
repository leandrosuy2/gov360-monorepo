// contracts DTO with enum import
import { ContractStatus } from "@prisma/client";
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
  @IsDateString()
  signedAt?: string;

  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;
}

export class UpdateContractDto {
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
