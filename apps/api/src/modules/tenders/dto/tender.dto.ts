import { Priority, TenderStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTenderDto {
  @IsString()
  noticeNumber!: string;

  @IsOptional()
  @IsString()
  processNumber?: string;

  @IsString()
  modality!: string;

  @IsString()
  object!: string;

  @IsString()
  agency!: string;

  @IsString()
  source!: string;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @IsOptional()
  @IsDateString()
  openingAt?: string;

  @IsOptional()
  @IsDateString()
  proposalDueAt?: string;

  @IsOptional()
  @IsEnum(TenderStatus)
  status?: TenderStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  opportunityId?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}

export class UpdateTenderDto {
  @IsOptional()
  @IsString()
  noticeNumber?: string;

  @IsOptional()
  @IsEnum(TenderStatus)
  status?: TenderStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
