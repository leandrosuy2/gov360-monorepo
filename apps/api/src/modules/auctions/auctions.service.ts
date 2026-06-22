import { Injectable, NotFoundException } from "@nestjs/common";
import { AuctionStatus, BidStrategy, Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { paginate, paginatedResult, serializeDates } from "@/common/utils/serialize";
import { CreateAuctionDto, CreateAuctionMessageDto, CreateBidDto, UpdateAuctionDto } from "./dto/auction.dto";

@Injectable()
export class AuctionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { status?: AuctionStatus; page?: number; limit?: number }) {
    const { page, limit, skip } = paginate(filters.page, filters.limit);
    const where: Prisma.AuctionSessionWhereInput = {};
    if (filters.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.auctionSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: "desc" },
        include: {
          tender: { select: { noticeNumber: true, agency: true, object: true } },
          _count: { select: { bids: true, messages: true } },
        },
      }),
      this.prisma.auctionSession.count({ where }),
    ]);

    return paginatedResult(data.map((a) => serializeDates(a)), total, page, limit);
  }

  async findOne(id: string) {
    const session = await this.prisma.auctionSession.findUnique({
      where: { id },
      include: {
        tender: true,
        bids: { orderBy: { createdAt: "desc" }, take: 50 },
        messages: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    if (!session) throw new NotFoundException("Sessão de pregão não encontrada");
    return serializeDates(session);
  }

  async create(dto: CreateAuctionDto) {
    const session = await this.prisma.auctionSession.create({ data: dto });
    return serializeDates(session);
  }

  async update(id: string, dto: UpdateAuctionDto) {
    await this.findOne(id);
    const session = await this.prisma.auctionSession.update({ where: { id }, data: dto });
    return serializeDates(session);
  }

  async placeBid(sessionId: string, dto: CreateBidDto) {
    await this.findOne(sessionId);
    const bid = await this.prisma.bid.create({
      data: { sessionId, amount: dto.amount, isAuto: dto.isAuto ?? false },
    });
    return serializeDates(bid);
  }

  async getActive() {
    const sessions = await this.prisma.auctionSession.findMany({
      where: { status: { in: ["SCHEDULED", "ACTIVE"] } },
      orderBy: [{ status: "asc" }, { startedAt: "desc" }],
      include: {
        tender: { select: { noticeNumber: true, agency: true, object: true } },
        _count: { select: { bids: true, messages: true } },
        bids: { orderBy: { createdAt: "desc" }, take: 1 },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return sessions.map((s) => serializeDates(s));
  }

  async getMessages(sessionId: string) {
    await this.findOne(sessionId);
    const messages = await this.prisma.auctionMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 200,
    });
    return messages.map((message) => serializeDates(message));
  }

  async addMessage(sessionId: string, dto: CreateAuctionMessageDto) {
    await this.findOne(sessionId);
    const message = await this.prisma.auctionMessage.create({
      data: {
        sessionId,
        content: dto.content.trim(),
        sender: dto.sender?.trim() || "Equipe GOV360",
        isFromUs: dto.isFromUs ?? true,
      },
    });
    return serializeDates(message);
  }
}
