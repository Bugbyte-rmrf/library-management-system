
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Create or update genres
  const genreData = [
    { name: 'Fiction', slug: 'fiction' },
    { name: 'Science', slug: 'science' },
    { name: 'History', slug: 'history' },
    { name: 'Technology', slug: 'technology' },
  ];

  const genres = await Promise.all(
    genreData.map((genre) =>
      prisma.genre.upsert({
        where: { slug: genre.slug },
        update: { name: genre.name },
        create: genre,
      }),
    ),
  );

  // 2. Get genre IDs
  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.slug, genre.id]),
  );

  // 3. Prepare books
  const books = [
    // Fiction
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227',
      genreId: genreMap.fiction,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441172719',
      genreId: genreMap.fiction,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      genreId: genreMap.fiction,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      genreId: genreMap.fiction,
    },

    // Science
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '9780553380163',
      genreId: genreMap.science,
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      isbn: '9780345539434',
      genreId: genreMap.science,
    },
    {
      title: 'The Selfish Gene',
      author: 'Richard Dawkins',
      isbn: '9780198788607',
      genreId: genreMap.science,
    },
    {
      title: 'Astrophysics for People in a Hurry',
      author: 'Neil deGrasse Tyson',
      isbn: '9780393609394',
      genreId: genreMap.science,
    },

    // History
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      genreId: genreMap.history,
    },
    {
      title: 'The Silk Roads',
      author: 'Peter Frankopan',
      isbn: '9781101912379',
      genreId: genreMap.history,
    },
    {
      title: 'Guns, Germs, and Steel',
      author: 'Jared Diamond',
      isbn: '9780393354324',
      genreId: genreMap.history,
    },
    {
      title: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      isbn: '9780553296983',
      genreId: genreMap.history,
    },

    // Technology
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      genreId: genreMap.technology,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      isbn: '9780135957059',
      genreId: genreMap.technology,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '9780262046305',
      genreId: genreMap.technology,
    },
    {
      title: 'Design Patterns',
      author: 'Erich Gamma',
      isbn: '9780201633610',
      genreId: genreMap.technology,
    },
  ];

  // 4. Insert books
  const result = await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  console.log(`Created ${result.count} books.`);
  console.log(`Processed ${genres.length} genres.`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
