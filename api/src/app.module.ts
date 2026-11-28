import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CatalogModule } from './catalog/catalog.module';
import { GenresModule } from './genres/genres.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, GenresModule, BooksModule, CatalogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
