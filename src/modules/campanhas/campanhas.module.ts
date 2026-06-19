import { Module } from "@nestjs/common";

import { EmailsModule } from "../emails/emails.module";
import { SindicatosModule } from "../sindicatos/sindicatos.module";
import { EnviarCampanhaSindicatoDigitalUseCase } from "./application/usecases/enviar-campanha-sindicato-digital.usecase";
import { PreviewCampanhaSindicatoDigitalUseCase } from "./application/usecases/preview-campanha-sindicato-digital.usecase";
import { CampanhasController } from "./presentation/controllers/campanhas.controller";

@Module({
  imports: [EmailsModule, SindicatosModule],
  controllers: [CampanhasController],
  providers: [
    PreviewCampanhaSindicatoDigitalUseCase,
    EnviarCampanhaSindicatoDigitalUseCase,
  ],
})
export class CampanhasModule {}
