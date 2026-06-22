import { FinancialStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFinancialDto {
  @IsString()
  contractId!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsEnum(FinancialStatus)
  status?: FinancialStatus;

  @IsOptional()
  @IsDateString()
  referenceDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateFinancialDto {
  @IsOptional()
  @IsEnum(FinancialStatus)
  status?: FinancialStatus;

  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
