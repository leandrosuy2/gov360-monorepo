import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

function databaseUrl() {
  const url = (process.env.DATABASE_URL ?? "").replace(/^mysql:\/\//, "mariadb://");
  if (!url || url.includes("allowPublicKeyRetrieval=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}allowPublicKeyRetrieval=true`;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      adapter: new PrismaMariaDb(databaseUrl()),
      log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
