import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { DocumentCategory, DocumentStatus } from "@prisma/client";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto/document.dto";
import { DocumentsService } from "./documents.service";

@Controller("documents")
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(
    @Query("category") category?: DocumentCategory,
    @Query("status") status?: DocumentStatus,
    @Query("search") search?: string,
    @Query("certificatesOnly") certificatesOnly?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.documentsService.findAll({
      category,
      status,
      search,
      certificatesOnly: certificatesOnly === "true",
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get("certificates/stats")
  certificateStats() {
    return this.documentsService.getStats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.documentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.documentsService.remove(id);
  }
}
