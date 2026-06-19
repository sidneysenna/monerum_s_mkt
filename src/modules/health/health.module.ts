import { Module } from "@nestjs/common";

import { ObterHealthUseCase } from "./application/usecases/obter-health.usecase";
import { HealthController } from "./presentation/controllers/health.controller";

@Module({
  controllers: [HealthController],
  providers: [ObterHealthUseCase],
})
export class HealthModule {}
