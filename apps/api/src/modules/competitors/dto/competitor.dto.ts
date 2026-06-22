import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCompetitorDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  cnpj?: string;
}

export class CreateCompetitorWinDto {
  @IsString()
  agency!: string;

  @IsOptional()
  @IsString()
  object?: string;

  @IsOptional()
  @IsString()
  modality?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsDateString()
  wonAt?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
