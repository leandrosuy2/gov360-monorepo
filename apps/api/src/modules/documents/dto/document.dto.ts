// Updated imports without DocumentCategory enum
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

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
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  tenderId?: string;

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
