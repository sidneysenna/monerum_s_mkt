import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" ? value.trim() : value;

const toBoolean = ({ value }: { value: unknown }): unknown => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return value;
};

export class EnviarCampanhaQueryDto {
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
  @Max(10)
  limit?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  dryRun?: boolean;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  confirmacao?: string;
}
