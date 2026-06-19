import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" ? value.trim() : value;

export class PreviewCampanhaQueryDto {
  @IsOptional()
  @IsString()
  @Transform(trimString)
  denominacao?: string;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  nomePresidente?: string;
}
