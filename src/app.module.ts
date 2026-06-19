import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CampanhasModule } from "./modules/campanhas/campanhas.module";
import { EmailsModule } from "./modules/emails/emails.module";
import { HealthModule } from "./modules/health/health.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { TemplatesModule } from "./modules/templates/templates.module";
import { SindicatosModule } from "./modules/sindicatos/sindicatos.module";
import { PrismaModule } from "./shared/infrastructure/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    SindicatosModule,
    LeadsModule,
    CampanhasModule,
    EmailsModule,
    TemplatesModule,
  ],
})
export class AppModule {}
