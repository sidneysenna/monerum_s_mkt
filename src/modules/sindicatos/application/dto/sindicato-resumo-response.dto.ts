export class SindicatoResumoResponseDto {
  id!: number;
  cnpj!: string | null;
  denominacao!: string | null;
  grau!: string | null;
  ufSede!: string | null;
  localidadeSede!: string | null;
  email!: string;
  nomePresidente!: string | null;
}

export class SindicatosPaginationDto {
  limit!: number;
  offset!: number;
  count!: number;
}

export class ListarSindicatosResponseDto {
  items!: SindicatoResumoResponseDto[];
  pagination!: SindicatosPaginationDto;
}
