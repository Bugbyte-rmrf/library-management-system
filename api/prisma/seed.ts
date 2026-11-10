
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

  // 2. Get genre IDs dynamically from the database
  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.slug, genre.id]),
  );

  // 3. Prepare books with meaningful descriptions
  const books = [
    // FICTION
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227',
      description:
        'Bilbo Baggins, a quiet hobbit, is unexpectedly drawn into an adventurous quest with a group of dwarves to reclaim their lost kingdom and treasure from the dragon Smaug. Along the journey, he discovers courage, friendship, and his own hidden strengths.',
      genreId: genreMap.fiction,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441172719',
      description:
        'Set in a distant future, Dune follows Paul Atreides as his family takes control of the desert planet Arrakis, the only source of a valuable substance known as spice. The story explores political conflict, environmental survival, religion, power, and destiny.',
      genreId: genreMap.fiction,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      description:
        'In a totalitarian society ruled by the mysterious Big Brother, Winston Smith struggles against constant surveillance, propaganda, and the suppression of independent thought. This dystopian novel examines government control, truth, freedom, and individual resistance.',
      genreId: genreMap.fiction,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      description:
        'Elizabeth Bennet navigates family expectations, social class, relationships, and misunderstandings in nineteenth-century England. Her complicated relationship with the reserved Mr. Darcy explores how pride and prejudice can prevent people from understanding one another.',
      genreId: genreMap.fiction,
    },

    // SCIENCE
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '9780553380163',
      description:
        'Stephen Hawking introduces readers to major ideas in modern cosmology, including the Big Bang, black holes, space, and the nature of time. The book makes complex scientific questions accessible while exploring humanity’s search for an understanding of the universe.',
      genreId: genreMap.science,
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      isbn: '9780345539434',
      description:
        'Carl Sagan takes readers on a journey through the universe, exploring astronomy, planetary science, the origins of life, and the history of scientific discovery. The book celebrates curiosity and explains humanity’s place in the vastness of space.',
      genreId: genreMap.science,
    },
    {
      title: 'The Selfish Gene',
      author: 'Richard Dawkins',
      isbn: '9780198788607',
      description:
        'Richard Dawkins presents an influential explanation of evolution through the perspective of genes and natural selection. He explores how genetic information influences behaviour, cooperation, competition, and the development of living organisms.',
      genreId: genreMap.science,
    },
    {
      title: 'Astrophysics for People in a Hurry',
      author: 'Neil deGrasse Tyson',
      isbn: '9780393609394',
      description:
        'Neil deGrasse Tyson introduces essential concepts in astrophysics through short, approachable chapters. Readers explore the Big Bang, dark matter, black holes, galaxies, and the fundamental forces that shape the universe.',
      genreId: genreMap.science,
    },

    // HISTORY
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      description:
        'Sapiens traces the development of humankind from early hunter-gatherer societies to modern civilizations. Yuval Noah Harari examines major transformations in human history, including agriculture, religion, money, empires, science, and technology.',
      genreId: genreMap.history,
    },
    {
      title: 'The Silk Roads',
      author: 'Peter Frankopan',
      isbn: '9781101912379',
      description:
        'Peter Frankopan presents a history of the world through the interconnected trade routes linking Asia, Europe, and the Middle East. The book explores how commerce, religion, migration, warfare, and cultural exchange shaped global civilization.',
      genreId: genreMap.history,
    },
    {
      title: 'Guns, Germs, and Steel',
      author: 'Jared Diamond',
      isbn: '9780393354324',
      description:
        'Jared Diamond investigates why different human societies developed at different rates of technological and political power. He examines geography, agriculture, domestic animals, disease, and environmental conditions as major influences on the course of history.',
      genreId: genreMap.history,
    },
    {
      title: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      isbn: '9780553296983',
      description:
        'Anne Frank records her thoughts, fears, hopes, and everyday experiences while hiding with her family from Nazi persecution during the Second World War. Her diary offers a deeply personal account of life under oppression and the resilience of the human spirit.',
      genreId: genreMap.history,
    },

    // TECHNOLOGY
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      description:
        'Robert C. Martin explains principles and practical techniques for writing readable, maintainable, and reliable software. Through examples and programming guidelines, the book explores meaningful naming, functions, error handling, testing, and code organization.',
      genreId: genreMap.technology,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      isbn: '9780135957059',
      description:
        'This book presents practical advice for becoming a more effective and adaptable software developer. It covers problem-solving, automation, debugging, testing, software design, and professional habits that help programmers build dependable systems.',
      genreId: genreMap.technology,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '9780262046305',
      description:
        'This comprehensive textbook introduces fundamental algorithms and the mathematical techniques used to analyze their efficiency. It covers sorting, searching, data structures, graph algorithms, optimization, and other essential topics in computer science.',
      genreId: genreMap.technology,
    },
    {
      title: 'Design Patterns',
      author: 'Erich Gamma',
      isbn: '9780201633610',
      description:
        'This classic software engineering book introduces reusable object-oriented design patterns for solving recurring software development problems. It explains patterns such as Factory Method, Observer, Adapter, and Singleton, helping developers create flexible and maintainable applications.',
      genreId: genreMap.technology,
    },
  ];

  // 4. Create new books or update existing books using ISBN
  const results = await Promise.all(
    books.map((book) =>
      prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {
          title: book.title,
          author: book.author,
          description: book.description,
          genreId: book.genreId,
        },
        create: book,
      }),
    ),
  );

  // 5. Display seeding results
  console.log(`Created or updated ${results.length} books.`);
  console.log(`Processed ${genres.length} genres.`);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

