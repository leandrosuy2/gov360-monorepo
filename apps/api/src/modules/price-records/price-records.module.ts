import { Module } from "@nestjs/common";
import { PriceRecordsController } from "./price-records.controller";
import { PriceRecordsService } from "./price-records.service";

@Module({ controllers: [PriceRecordsController], providers: [PriceRecordsService] })
export class PriceRecordsModule {}
