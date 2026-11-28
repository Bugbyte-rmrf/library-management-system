import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  const librarianPassword = process.env.SEED_LIBRARIAN_PASSWORD || 'ChangeMe123!';
  await prisma.user.upsert({
    where: { email: 'librarian@example.com' },
    update: { role: 'LIBRARIAN' },
    create: {
      name: 'Library Librarian',
      email: 'librarian@example.com',
      password: await bcrypt.hash(librarianPassword, 12),
      role: 'LIBRARIAN',
    },
  });

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

  // 2. Create a map of genre names to database IDs
  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.slug, genre.id]),
  );

  // 3. Book data
  const books = [
    // Fiction
    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      isbn: '9780385474542',
      description:
        'A novel about Okonkwo, a respected Igbo leader, and the changes brought to his community by colonialism.',
      genreId: genreMap.fiction,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      description:
        'A dystopian novel about surveillance, totalitarianism, and the dangers of absolute political power.',
      genreId: genreMap.fiction,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      description:
        'A classic novel exploring love, class, family, and social expectations in nineteenth-century England.',
      genreId: genreMap.fiction,
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      description:
        'A story of wealth, ambition, and the American Dream set during the Jazz Age.',
      genreId: genreMap.fiction,
    },

    // Science
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '9780553380163',
      description:
        'Stephen Hawking introduces readers to major ideas in modern cosmology, including the Big Bang, black holes, space, and the nature of time. The book makes complex scientific questions accessible while exploring humanity’s search for an understanding of the universe.',
      genreId: genreMap.science,
    },
    {
      title: 'The Selfish Gene',
      author: 'Richard Dawkins',
      isbn: '9780198788607',
      description:
        'An exploration of evolution and natural selection from the perspective of genes.',
      genreId: genreMap.science,
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      isbn: '9780345539434',
      description:
        'A journey through astronomy, science, and humanity’s place in the universe.',
      genreId: genreMap.science,
    },
    {
      title: 'The Origin of Species',
      author: 'Charles Darwin',
      isbn: '9781509827695',
      description:
        'Darwin’s foundational work explaining evolution through natural selection.',
      genreId: genreMap.science,
    },

    // History
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      description:
        'A broad history of humankind, from early humans to modern societies.',
      genreId: genreMap.history,
    },
    {
      title: 'The Art of War',
      author: 'Sun Tzu',
      isbn: '9781590302255',
      description:
        'An ancient Chinese military text exploring strategy, leadership, and conflict.',
      genreId: genreMap.history,
    },
    {
      title: 'Guns, Germs, and Steel',
      author: 'Jared Diamond',
      isbn: '9780393354324',
      description:
        'An examination of the environmental and geographical factors that shaped human history.',
      genreId: genreMap.history,
    },
    {
      title: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      isbn: '9780553296983',
      description:
        'The diary of Anne Frank, documenting her life in hiding during the Holocaust.',
      genreId: genreMap.history,
    },

    // Technology
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      description:
        'A guide to writing readable, maintainable, and well-structured software.',
      genreId: genreMap.technology,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt and David Thomas',
      isbn: '9780135957059',
      description:
        'Practical advice and techniques for becoming a more effective software developer.',
      genreId: genreMap.technology,
    },
    {
      title: 'Code',
      author: 'Charles Petzold',
      isbn: '9780137909100',
      description:
        'An explanation of how computers work, from basic circuits to software.',
      genreId: genreMap.technology,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein',
      isbn: '9780262046305',
      description:
        'A comprehensive introduction to algorithms and their design and analysis.',
      genreId: genreMap.technology,
    },
  ];

  // 4. Create or update books using ISBN
  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        description: book.description,
        genreId: book.genreId,
      },
      create: book,
    });
  }

  console.log(`Created or updated ${books.length} books.`);
  console.log(`Processed ${genres.length} genres.`);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('Error while seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
