import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { HealthModule } from "./health/health.module";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";

@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
