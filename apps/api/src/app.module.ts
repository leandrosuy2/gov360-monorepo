import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuditModule } from "./modules/audit/audit.module";
import { AuctionsModule } from "./modules/auctions/auctions.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CompetitorsModule } from "./modules/competitors/competitors.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { FinancialModule } from "./modules/financial/financial.module";
import { HealthModule } from "./modules/health/health.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { OpportunitiesModule } from "./modules/opportunities/opportunities.module";
import { ProposalsModule } from "./modules/proposals/proposals.module";
import { PriceRecordsModule } from "./modules/price-records/price-records.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TenderAnalysisModule } from "./modules/tender-analysis/tender-analysis.module";
import { TendersModule } from "./modules/tenders/tenders.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditModule,
    HealthModule,
    AuthModule,
    UsersModule,
    OpportunitiesModule,
    TendersModule,
    DashboardModule,
    DocumentsModule,
    TasksModule,
    ContractsModule,
    ProposalsModule,
    PriceRecordsModule,
    AuctionsModule,
    CompetitorsModule,
    FinancialModule,
    TenderAnalysisModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
