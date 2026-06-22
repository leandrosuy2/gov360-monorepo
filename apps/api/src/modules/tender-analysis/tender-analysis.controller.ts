import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateAnalysisDto } from "./dto/analysis.dto";
import { TenderAnalysisService } from "./tender-analysis.service";

@Controller("tender-analysis")
@UseGuards(JwtAuthGuard)
export class TenderAnalysisController {
  constructor(private readonly tenderAnalysisService: TenderAnalysisService) {}

  @Get("tender/:tenderId")
  findByTender(@Param("tenderId") tenderId: string) {
    return this.tenderAnalysisService.findByTender(tenderId);
  }

  @Post()
  create(@Body() dto: CreateAnalysisDto) {
    return this.tenderAnalysisService.create(dto);
  }

  @Post("tender/:tenderId/upload")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 25 * 1024 * 1024, files: 1 } }))
  analyzePdf(@Param("tenderId") tenderId: string, @UploadedFile() file?: Express.Multer.File) {
    return this.tenderAnalysisService.analyzePdf(tenderId, file);
  }
}
