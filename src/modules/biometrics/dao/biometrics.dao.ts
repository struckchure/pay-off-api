import { Injectable } from "@nestjs/common";

import {
  BiometricsCreateArgs,
  BiometricsDeleteArgs,
  BiometricsGetArgs,
  BiometricsListArgs,
  BiometricsUpdateArgs,
} from "@/modules/biometrics/interfaces/biometrics.interface";
import { PrismaService } from "@/shared/prisma/prisma.service";

@Injectable()
export class BiometricsDAO {
  constructor(private prismaService: PrismaService) {}

  async biometricsList(biometricsListArgs: BiometricsListArgs) {
    return await this.prismaService.biometric.findMany({
      where: {
        ...(biometricsListArgs.biometricType
          ? {
              biometricType: biometricsListArgs.biometricType,
            }
          : {}),
        ...(biometricsListArgs.userId
          ? {
              userId: biometricsListArgs.userId,
            }
          : {}),
      },
      skip: biometricsListArgs.skip || 0,
      take: biometricsListArgs.take || 10,
    });
  }

  async biometricsCreate(biometricsCreateArgs: BiometricsCreateArgs) {
    const biometricExists = !(await this.prismaService.biometric.findFirst({
      where: {
        userId: biometricsCreateArgs.userId,
        biometricType: biometricsCreateArgs.biometricType,
      },
    }));
    if (!biometricExists)
      throw Error(
        `${biometricsCreateArgs.biometricType.toLowerCase()} biometric for user already exists`,
      );

    return await this.prismaService.biometric.create({
      data: biometricsCreateArgs,
    });
  }

  async biometricsGet(biometricsGetArgs: BiometricsGetArgs) {
    return await this.prismaService.biometric.findFirst({
      where: {
        ...(biometricsGetArgs.id ? { id: biometricsGetArgs.id } : {}),
        ...(biometricsGetArgs.userId
          ? { userId: biometricsGetArgs.userId }
          : {}),
      },
    });
  }

  async biometricsUpdate(
    biometricsGetArgs: BiometricsGetArgs,
    biometricsUpdateArgs: BiometricsUpdateArgs,
  ) {
    return await this.prismaService.biometric.update({
      where: {
        ...(biometricsGetArgs.id ? { id: biometricsGetArgs.id } : {}),
        ...(biometricsGetArgs.userId
          ? { userId: biometricsGetArgs.userId }
          : {}),
      },
      data: biometricsUpdateArgs,
    });
  }

  async biometricsDelete(biometricsDeleteArgs: BiometricsDeleteArgs) {
    const biometricExists = !!(await this.biometricsGet(biometricsDeleteArgs));
    if (!biometricExists) throw new Error("Biometrics not found");

    await this.prismaService.biometric.delete({
      where: {
        ...(biometricsDeleteArgs.id ? { id: biometricsDeleteArgs.id } : {}),
        ...(biometricsDeleteArgs.userId
          ? { userId: biometricsDeleteArgs.userId }
          : {}),
      },
    });
  }
}
