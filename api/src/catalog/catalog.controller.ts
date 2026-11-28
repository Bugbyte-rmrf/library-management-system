import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('genres')
  getGenres() {
    return this.catalog.findGenres();
  }

  @Get('books')
  getBooks(
    @Query('search') search?: string,
    @Query('genreId') genreId?: string,
    @Query('sort') sort?: string,
  ) {
    let parsedGenreId: number | undefined;

    if (genreId !== undefined && genreId.trim() !== '') {
      parsedGenreId = Number(genreId);
      if (!Number.isInteger(parsedGenreId) || parsedGenreId < 1) {
        throw new BadRequestException('genreId must be a positive integer');
      }
    }

    return this.catalog.findBooks(search, parsedGenreId, sort);
  }

  @Get('books/:id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.catalog.findBookById(id);
  }
}
