import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/shared/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class AtomicHelper {
  constructor(private prismaService: PrismaService) {}

  async atomic(queries: Prisma.PrismaPromise<any>[]) {
    return await this.prismaService.$transaction([...queries]);
  }
}
