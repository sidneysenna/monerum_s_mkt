import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" ? value.trim() : value;

export class ListarSindicatosQueryDto {
  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toUpperCase() : value,
  )
  uf?: string;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  grau?: string;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  cadastro?: string;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  areaGeoeconomica?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
