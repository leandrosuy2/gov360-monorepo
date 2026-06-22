import { Module } from "@nestjs/common";
import { TenderAnalysisController } from "./tender-analysis.controller";
import { TenderAnalysisService } from "./tender-analysis.service";

@Module({ controllers: [TenderAnalysisController], providers: [TenderAnalysisService] })
export class TenderAnalysisModule {}
