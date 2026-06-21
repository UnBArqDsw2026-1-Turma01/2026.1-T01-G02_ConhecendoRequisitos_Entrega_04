import { IsInt, Max, Min } from 'class-validator';

export class UpdatePercentDto {
  @IsInt()
  @Min(0)
  @Max(100)
  percentualConcluido: number;
}
