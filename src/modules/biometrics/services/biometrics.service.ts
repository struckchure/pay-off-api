import { Injectable, NotFoundException } from "@nestjs/common";

import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import {
  IBiometricsCreate,
  IBiometricsUpdate,
} from "@/modules/biometrics/interfaces/biometrics.interface";
import { MediaService } from "@/shared/media/media.service";

@Injectable()
export class BiometricsService {
  constructor(
    private biometricsDAO: BiometricsDAO,
    private mediaService: MediaService,
  ) {}

  async biometricsCreate(
    biometricsCreateArgs: Omit<IBiometricsCreate, "biometricUrl"> & {
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
    biometricsUpdateArgs: Omit<IBiometricsUpdate, "biometricUrl"> & {
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
}
