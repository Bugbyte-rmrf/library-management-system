import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findGenres() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { books: true } } },
    });
  }

  async findBooks(search?: string, genreId?: number, sort?: string) {
    const where: {
      genreId?: number;
      OR?: Array<{ title: { contains: string; mode: 'insensitive' } } | { author: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (genreId !== undefined) {
      where.genreId = genreId;
    }

    if (search?.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { author: { contains: term, mode: 'insensitive' } },
      ];
    }

    const orderBy =
      sort === 'author'
        ? [{ author: 'asc' as const }, { title: 'asc' as const }]
        : sort === 'title'
          ? [{ title: 'asc' as const }]
          : [{ createdAt: 'desc' as const }];

    return this.prisma.book.findMany({
      where,
      include: {
        genre: true,
        _count: { select: { reviews: true } },
      },
      orderBy,
    });
  }

  async findBookById(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} was not found`);
    }

    return book;
  }
}
