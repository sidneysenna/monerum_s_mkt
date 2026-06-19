import { Module } from "@nestjs/common";

import { EmailsModule } from "../emails/emails.module";
import { SindicatosModule } from "../sindicatos/sindicatos.module";
import { CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY } from "./domain/repositories/campanha-email-destinatarios.repository";
import { CAMPANHAS_EMAIL_REPOSITORY } from "./domain/repositories/campanhas-email.repository";
import { PrismaCampanhaEmailDestinatariosRepository } from "./infrastructure/prisma/prisma-campanha-email-destinatarios.repository";
import { PrismaCampanhasEmailRepository } from "./infrastructure/prisma/prisma-campanhas-email.repository";
import { EnviarCampanhaSindicatoDigitalUseCase } from "./application/usecases/enviar-campanha-sindicato-digital.usecase";
import { ListarDestinatariosCampanhaUseCase } from "./application/usecases/listar-destinatarios-campanha.usecase";
import { ListarElegiveisCampanhaUseCase } from "./application/usecases/listar-elegiveis-campanha.usecase";
import { ObterStatusCampanhaUseCase } from "./application/usecases/obter-status-campanha.usecase";
import { PreviewCampanhaSindicatoDigitalUseCase } from "./application/usecases/preview-campanha-sindicato-digital.usecase";
import { CampanhasController } from "./presentation/controllers/campanhas.controller";

@Module({
  imports: [EmailsModule, SindicatosModule],
  controllers: [CampanhasController],
  providers: [
    PreviewCampanhaSindicatoDigitalUseCase,
    EnviarCampanhaSindicatoDigitalUseCase,
    ObterStatusCampanhaUseCase,
    ListarDestinatariosCampanhaUseCase,
    ListarElegiveisCampanhaUseCase,
    {
      provide: CAMPANHAS_EMAIL_REPOSITORY,
      useClass: PrismaCampanhasEmailRepository,
    },
    {
      provide: CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY,
      useClass: PrismaCampanhaEmailDestinatariosRepository,
    },
  ],
})
export class CampanhasModule {}
