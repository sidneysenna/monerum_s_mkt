import { Controller, Get } from "@nestjs/common";

import { HealthResponseDto } from "../../application/dto/health-response.dto";
import { ObterHealthUseCase } from "../../application/usecases/obter-health.usecase";

@Controller("health")
export class HealthController {
  constructor(private readonly obterHealthUseCase: ObterHealthUseCase) {}

  @Get()
  getHealth(): HealthResponseDto {
    return this.obterHealthUseCase.execute();
  }
}
