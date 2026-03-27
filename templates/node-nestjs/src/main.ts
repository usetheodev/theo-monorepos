import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const logger = new Logger("Bootstrap");

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}

bootstrap();
