import { Module } from "@nestjs/common";

import { BiometricsController } from "@/modules/biometrics/controllers/biometrics.controller";
import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import { BiometricsService } from "@/modules/biometrics/services/biometrics.service";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { MediaService } from "@/shared/media/media.service";

@Module({
  controllers: [BiometricsController],
  providers: [BiometricsService, BiometricsDAO, UserDAO, MediaService],
})
export class BiometricsModule {}
