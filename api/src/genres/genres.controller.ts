import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genres: GenresService) {}

  @Get()
  findAll() { return this.genres.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.genres.findOne(id); }

  @Post()
  @Roles('LIBRARIAN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateGenreDto) { return this.genres.create(dto); }

  @Patch(':id')
  @Roles('LIBRARIAN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGenreDto) {
    return this.genres.update(id, dto);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) { return this.genres.remove(id); }
}
