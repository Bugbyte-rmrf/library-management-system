import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  coverImage?: string;

  @IsInt()
  @Min(0)
  totalCopies: number;

  @IsInt()
  @Min(0)
  availableCopies: number;

  @IsInt()
  @Min(1)
  genreId: number;
}
