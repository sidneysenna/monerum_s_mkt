export class SindicatoEntity {
  constructor(
    public readonly id: number,
    public readonly cnpj: string | null,
    public readonly denominacao: string | null,
    public readonly grau: string | null,
    public readonly ufSede: string | null,
    public readonly localidadeSede: string | null,
    public readonly email: string,
    public readonly nomePresidente: string | null,
  ) {}
}
