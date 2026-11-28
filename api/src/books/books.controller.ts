import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { BooksService } from './books.service';
import { BookQueryDto } from './dto/book-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  findAll(@Query() query: BookQueryDto) {
    return this.books.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.books.findOne(id);
  }

  @Post()
  @Roles('LIBRARIAN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateBookDto) {
    return this.books.create(dto);
  }

  @Patch(':id')
  @Roles('LIBRARIAN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.books.update(id, dto);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.books.remove(id);
  }
}
