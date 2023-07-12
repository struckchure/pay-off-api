import { Injectable, NotImplementedException } from "@nestjs/common";

import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import {
  BiometricType,
  BiometricsCreateArgs,
  BiometricsUpdateArgs,
  BiometricsVerify,
} from "@/modules/biometrics/interfaces/biometrics.interface";
import { BiometricsClient } from "@/shared/clients/biometrics";
import { MediaService } from "@/shared/media/media.service";

@Injectable()
export class BiometricsService {
  constructor(
    private mediaService: MediaService,
    private biometricsClient: BiometricsClient,

    private biometricsDAO: BiometricsDAO,
  ) {}

  async biometricsCreate(
    biometricsCreateArgs: Omit<BiometricsCreateArgs, "biometricUrl"> & {
      image: Express.Multer.File;
    },
  ) {
    return this.biometricsDAO.biometricsCreate({
      userId: biometricsCreateArgs.userId,
      biometricType: biometricsCreateArgs.biometricType,
      biometricUrl: (await this.mediaService.upload(biometricsCreateArgs.image))
        .key,
    });
  }

  async biometricsGet(userId: string) {
    return await this.biometricsDAO.biometricsList({ userId });
  }

  async biometricsUpdate(
    biometricId: string,
    biometricsUpdateArgs: Omit<BiometricsUpdateArgs, "biometricUrl"> & {
      image: Express.Multer.File;
    },
  ) {
    return await this.biometricsDAO.biometricsUpdate(
      { id: biometricId },
      {
        biometricType: biometricsUpdateArgs.biometricType,
        biometricUrl: (
          await this.mediaService.upload(biometricsUpdateArgs.image)
        ).key,
      },
    );
  }

  async biometricsDelete(biometricId: string) {
    await this.biometricsDAO.biometricsDelete({ id: biometricId });
  }

  private isBiometricsValid(matchScore: number) {
    if (matchScore >= 75) return true;
    else return false;
  }

  async biometricsVerify(biometricsVerifyArgs: BiometricsVerify) {
    switch (biometricsVerifyArgs.biometricType) {
      case BiometricType.FINGERPRINT:
        const { matchScore } = await this.biometricsClient.fingerprintVerify({
          target: biometricsVerifyArgs.target,
          sample: biometricsVerifyArgs.sample,
        });

        return {
          status: this.isBiometricsValid(matchScore),
          matchScore,
        };
      default:
        throw new NotImplementedException();
    }
  }
}
