import { Module } from '@nestjs/common';

import {
  SINDICATOS_REPOSITORY,
} from './domain/repositories/sindicatos.repository';
import { ListarSindicatosUseCase } from './application/usecases/listar-sindicatos.usecase';
import { PrismaSindicatosRepository } from './infrastructure/prisma/prisma-sindicatos.repository';
import { SindicatosController } from './presentation/controllers/sindicatos.controller';

@Module({
  controllers: [SindicatosController],
  providers: [
    ListarSindicatosUseCase,
    {
      provide: SINDICATOS_REPOSITORY,
      useClass: PrismaSindicatosRepository,
    },
  ],
})
export class SindicatosModule {}
