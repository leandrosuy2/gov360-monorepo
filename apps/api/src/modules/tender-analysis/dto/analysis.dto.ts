import { IsOptional, IsString } from "class-validator";

export class CreateAnalysisDto {
  @IsString()
  tenderId!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  riskMap?: unknown;

  @IsOptional()
  checklist?: unknown;

  @IsOptional()
  requirements?: unknown;

  @IsOptional()
  deadlines?: unknown;

  @IsOptional()
  @IsString()
  rawText?: string;
}
