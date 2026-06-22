import { DocumentCategory } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsString()
  fileName!: string;

  @IsString()
  storageKey!: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  sizeBytes?: number;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  tenderId?: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
