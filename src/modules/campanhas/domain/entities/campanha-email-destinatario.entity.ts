export class CampanhaEmailDestinatarioEntity {
  constructor(
    public readonly id: string,
    public readonly campanhaId: string,
    public readonly sindicatoId: number,
    public readonly email: string,
    public readonly emailNormalizado: string,
    public readonly status: string,
    public readonly tentativas: number,
    public readonly enviadoEm: Date | null,
    public readonly ultimoErro: string | null = null,
    public readonly mailgunMessageId: string | null = null,
  ) {}
}
