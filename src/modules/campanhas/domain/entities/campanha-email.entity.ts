export class CampanhaEmailEntity {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly slug: string,
    public readonly nome: string,
    public readonly templateId: string,
    public readonly status: string,
    public readonly limiteDiario: number,
    public readonly descricao: string | null = null,
  ) {}
}
