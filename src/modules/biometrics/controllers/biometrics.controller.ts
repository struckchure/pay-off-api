import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";

import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import {
  BiometricsCreateDTO,
  BiometricsUpdateDTO,
} from "@/modules/biometrics/dto/biometrics.dto";
import { BiometricType } from "@/modules/biometrics/interfaces/biometrics.interface";
import { BiometricsService } from "@/modules/biometrics/services/biometrics.service";

@Controller("biometrics")
@UseGuards(AuthGuard)
export class BiometricsController {
  constructor(private biometricsService: BiometricsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("image"))
  async biometricsCreate(
    @Req() request: Request,
    @Body() biometricsCreateDTO: BiometricsCreateDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.biometricsService.biometricsCreate({
      ...biometricsCreateDTO,
      userId: request.user.id,
      image,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async biometricsGet(@Req() request: Request) {
    return await this.biometricsService.biometricsGet(request.user.id);
  }

  @Patch(":biometricId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor("image"))
  async biometricsUpdate(
    @Param("biometricId") biometricId: string,
    @Body() biometricsUpdateDTO: BiometricsUpdateDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.biometricsService.biometricsUpdate(biometricId, {
      ...biometricsUpdateDTO,
      image,
    });
  }

  @Delete(":biometricId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async biometricsDelete(@Param("biometricId") biometricId: string) {
    await this.biometricsService.biometricsDelete(biometricId);
  }

  @Post("verify")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "target", maxCount: 1 },
      { name: "sample", maxCount: 1 },
    ]),
  )
  async biometricsVerification(
    @UploadedFiles()
    files: {
      target: Express.Multer.File[];
      sample: Express.Multer.File[];
    },
  ) {
    const { target, sample } = files;

    return this.biometricsService.biometricsVerify({
      biometricType: BiometricType.FINGERPRINT,
      target: target[0],
      sample: sample[0],
    });
  }
}
