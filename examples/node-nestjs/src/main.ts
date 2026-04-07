import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PinoLogger } from "./logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLogger(),
  });
  const port = process.env.PORT || 3000;

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(port);
  new PinoLogger().log(`Server running on port ${port}`, "Bootstrap");
}

bootstrap();
