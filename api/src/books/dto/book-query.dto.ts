import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class BookQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @Min(1)
  genreId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsIn(['title', 'author'])
  sort?: 'title' | 'author';
}
