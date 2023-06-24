import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api/:apiVersion");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
