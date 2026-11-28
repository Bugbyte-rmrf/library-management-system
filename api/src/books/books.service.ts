import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookQueryDto } from './dto/book-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: BookQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: {
      genreId?: number;
      OR?: Array<{ title: { contains: string; mode: 'insensitive' } } | { author: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (query.genreId) where.genreId = query.genreId;
    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = query.sort
      ? [{ [query.sort]: 'asc' as const }]
      : [{ createdAt: 'desc' as const }];

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          genre: true,
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!book) throw new NotFoundException(`Book ${id} was not found`);
    return book;
  }

  async create(dto: CreateBookDto) {
    await this.ensureGenre(dto.genreId);
    try {
      return await this.prisma.book.create({
        data: dto,
        include: { genre: true },
      });
    } catch (error: unknown) {
      if (this.isUniqueError(error)) throw new ConflictException('ISBN already exists');
      throw error;
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    if (dto.genreId !== undefined) await this.ensureGenre(dto.genreId);

    try {
      return await this.prisma.book.update({
        where: { id },
        data: dto,
        include: { genre: true },
      });
    } catch (error: unknown) {
      if (this.isUniqueError(error)) throw new ConflictException('ISBN already exists');
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenre(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} was not found`);
  }

  private isUniqueError(error: unknown): boolean {
    return !!error && typeof error === 'object' && 'code' in error && error.code === 'P2002';
  }
}
