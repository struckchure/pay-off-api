import { HttpService } from "@nestjs/axios";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import {
  BiometricType,
  BiometricsCreateArgs,
  BiometricsUpdateArgs,
  BiometricsVerify,
} from "@/modules/biometrics/interfaces/biometrics.interface";
import { BIOMETRICS_VERIFICATION_API_URL } from "@/shared/constants/env-vars";
import { MediaService } from "@/shared/media/media.service";

interface BiometricsVerificationResponse {
  matchScore: number;
}

@Injectable()
export class BiometricsService {
  constructor(
    private mediaService: MediaService,
    private httpsService: HttpService,

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

  async biometricsVerify(biometricsVerifyArgs: BiometricsVerify) {
    switch (biometricsVerifyArgs.biometricType) {
      case BiometricType.FINGERPRINT:
        const payload = new FormData();
        payload.append(
          "target",
          new Blob([biometricsVerifyArgs.target.buffer]),
          biometricsVerifyArgs.target.originalname,
        );
        payload.append(
          "sample",
          new Blob([biometricsVerifyArgs.sample.buffer]),
          biometricsVerifyArgs.sample.originalname,
        );

        const biometricsVerificationResponse =
          this.httpsService.post<BiometricsVerificationResponse>(
            `${BIOMETRICS_VERIFICATION_API_URL}/fingerprint/`,
            payload,
          );
        const result = await firstValueFrom(biometricsVerificationResponse);
        const {
          data: { matchScore },
        } = result;

        if (matchScore >= 75) return { status: true, matchRate: matchScore };

        return { status: false, matchRate: matchScore };
      default:
        throw new NotImplementedException();
    }
  }
}
