import { Injectable } from '@nestjs/common';

import { HealthResponseDto } from '../dto/health-response.dto';

@Injectable()
export class ObterHealthUseCase {
  execute(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'monerum_s_mkt',
      version: 'v1',
      timestamp: new Date().toISOString(),
    };
  }
}
