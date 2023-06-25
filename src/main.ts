import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/app.module";
import { ErrorExceptionFilter } from "@/shared/filters/error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api/:apiVersion");
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorExceptionFilter());

  await app.listen(3000);
}
bootstrap();
