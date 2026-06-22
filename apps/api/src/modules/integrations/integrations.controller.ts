import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { IntegrationsService } from "./integrations.service";

class SyncPncpDto {
  @IsOptional()
  @IsNumber()
  daysBack?: number;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

@Controller("integrations")
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get("portals")
  listPortals() {
    return this.integrationsService.listPortals();
  }

  @Get("catalog")
  catalog() {
    return this.integrationsService.getCatalog();
  }

  @Get("status")
  status() {
    return this.integrationsService.getConnectorStatus();
  }

  @Get(":code/test")
  test(@Param("code") code: string) {
    return this.integrationsService.testConnector(code);
  }

  @Get("logs")
  listLogs(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.integrationsService.listIntegrationLogs(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Post("pncp/sync")
  syncPncp(@Body() dto: SyncPncpDto) {
    return this.integrationsService.syncPncp(dto);
  }

  @Post("compras-gov/sync")
  syncComprasGov(@Body() dto: SyncPncpDto) {
    return this.integrationsService.syncComprasGov(dto);
  }
}
