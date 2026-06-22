import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PDFParse } from "pdf-parse";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { extname, join } from "node:path";
import { PrismaService } from "@/prisma/prisma.service";
import { serializeDates } from "@/common/utils/serialize";
import { CreateAnalysisDto } from "./dto/analysis.dto";

@Injectable()
export class TenderAnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTender(tenderId: string) {
    const analysis = await this.prisma.tenderAnalysis.findUnique({ where: { tenderId }, include: { tender: true } });
    if (!analysis) throw new NotFoundException("Análise não encontrada para esta licitação");
    return serializeDates(analysis);
  }

  async create(dto: CreateAnalysisDto) {
    const data = {
      tenderId: dto.tenderId,
      summary: dto.summary,
      riskMap: dto.riskMap as Prisma.InputJsonValue | undefined,
      checklist: dto.checklist as Prisma.InputJsonValue | undefined,
      requirements: dto.requirements as Prisma.InputJsonValue | undefined,
      deadlines: dto.deadlines as Prisma.InputJsonValue | undefined,
      rawText: dto.rawText,
    };

    const analysis = await this.prisma.tenderAnalysis.upsert({
      where: { tenderId: dto.tenderId },
      create: data,
      update: { ...data, analyzedAt: new Date() },
    });
    return serializeDates(analysis);
  }

  async analyzePdf(tenderId: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("Envie um arquivo PDF");
    if (file.mimetype !== "application/pdf" || extname(file.originalname).toLowerCase() !== ".pdf") {
      throw new BadRequestException("Somente arquivos PDF são permitidos");
    }
    const tender = await this.prisma.tender.findUnique({ where: { id: tenderId } });
    if (!tender) throw new NotFoundException("Licitação não encontrada");

    let rawText = "";
    const parser = new PDFParse({ data: file.buffer });
    try {
      const result = await parser.getText();
      rawText = result.text.replace(/\u0000/g, "").trim();
    } catch {
      throw new BadRequestException("Não foi possível ler o PDF. O arquivo pode estar protegido ou conter apenas imagens.");
    } finally {
      await parser.destroy();
    }
    if (rawText.length < 50) throw new BadRequestException("O PDF não possui texto suficiente para análise automática");

    const storageDir = join(process.cwd(), "storage", "documents");
    await mkdir(storageDir, { recursive: true });
    const storageName = `${randomUUID()}.pdf`;
    const storagePath = join(storageDir, storageName);
    await writeFile(storagePath, file.buffer);

    const lines = rawText.split(/\r?\n/).map((line) => line.replace(/\s+/g, " ").trim()).filter((line) => line.length > 8);
    const unique = (items: string[]) => [...new Set(items)].slice(0, 30);
    const requirements = unique(lines.filter((line) => /(obrigat|exig|deverá|deve apresentar|habilita|certid|atestado|declaraç|comprova)/i.test(line)));
    const deadlineLines = unique(lines.filter((line) => /(prazo|data|abertura|entrega|vigência|validade).{0,100}(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d+\s+dias?)/i.test(line)));
    const riskRules = [
      ["ALTO", /(multa|sanção|penalidade|rescisão)/i, "Penalidades e sanções"],
      ["ALTO", /(garantia contratual|garantia de execução)/i, "Exigência de garantia"],
      ["MÉDIO", /(amostra|prova de conceito|demonstração)/i, "Amostra ou prova de conceito"],
      ["MÉDIO", /(prazo de entrega.{0,50}(imediat|\d\s*dias?))/i, "Prazo de entrega restritivo"],
      ["MÉDIO", /(visita técnica|vistoria)/i, "Visita técnica ou vistoria"],
    ] as const;
    const risks = riskRules.filter(([, pattern]) => pattern.test(rawText)).map(([severity, , title]) => ({ severity, title, status: "PENDENTE" }));
    const summarySource = lines.filter((line) => !/^\d+$/.test(line)).slice(0, 18).join(" ");
    const summary = `${tender.modality} ${tender.noticeNumber}, promovida por ${tender.agency}. ${summarySource}`.slice(0, 2200);
    const checklist = requirements.slice(0, 20).map((title, index) => ({ id: index + 1, title, completed: false }));
    const deadlines = deadlineLines.map((description, index) => ({ id: index + 1, description }));

    const analysis = await this.prisma.$transaction(async (tx) => {
      await tx.document.create({
        data: {
          name: `Edital ${tender.noticeNumber}`,
          category: "EDITAL",
          fileName: file.originalname,
          storageKey: storagePath,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          status: "VALID",
          tenderId,
          versions: { create: { version: 1, fileName: file.originalname, storageKey: storagePath, sizeBytes: file.size } },
        },
      });
      return tx.tenderAnalysis.upsert({
        where: { tenderId },
        create: { tenderId, summary, requirements, checklist, deadlines, riskMap: risks, rawText: rawText.slice(0, 500000) },
        update: { summary, requirements, checklist, deadlines, riskMap: risks, rawText: rawText.slice(0, 500000), analyzedAt: new Date() },
      });
    });
    return serializeDates({ ...analysis, extractedCharacters: rawText.length, fileName: file.originalname });
  }
}
