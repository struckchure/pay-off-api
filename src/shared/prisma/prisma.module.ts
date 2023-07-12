import { Global, Module } from "@nestjs/common";

import { PrismaService } from "@/shared/prisma/prisma.service";
import { AtomicHelper } from "@/shared/prisma/prisma.utils";

@Module({
  providers: [PrismaService, AtomicHelper],
  exports: [PrismaService, AtomicHelper],
})
@Global()
export class PrismaModule {}
