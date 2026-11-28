# Library Management System

## 1. Project Overview

The Library Management System is a backend application built with **NestJS, PostgreSQL and Prisma ORM**.

The project demonstrates how to design and implement a relational database, connect it to a NestJS application, manage database migrations and populate the database with initial records.

The database is hosted on **Neon PostgreSQL**, while Prisma is used to define the database schema, manage relationships and communicate with the database.

The initial implementation focuses on the database foundation and application architecture. It establishes the core models required for a library management system, including users, books, genres and reviews.

## 2. Project Objectives

The main objectives are to:

- Understand NestJS architecture and its advantages over a basic Node.js/Express application.
- Configure a PostgreSQL database using Neon.
- Integrate Prisma ORM into a NestJS project.
- Design relational database models.
- Define one-to-many and many-to-one relationships.
- Implement database migrations.
- Seed the database with initial genres and books.
- Understand dependency injection and service providers in NestJS.
- Explore the differences between relational and document databases.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Application programming language |
| NestJS | Backend application framework |
| PostgreSQL | Relational database |
| Neon | Hosted PostgreSQL database provider |
| Prisma ORM 6.19.0 | Database ORM and schema management |
| Prisma Client | Database query interface |
| npm | Package manager |
| Prisma Studio | Visual database inspection tool |

## 4. Project Structure

The project is organized into a root directory and a NestJS application inside the `api` directory.

```text
library-management-system/
│
├── api/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   │
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

The `prisma` directory contains the database schema, seed script and migration history.

The `src` directory contains the NestJS application code and Prisma integration.

The root README documents the project and its implementation decisions.

## 5. Database Configuration

### PostgreSQL and Neon

Neon was used to host the PostgreSQL database.

A PostgreSQL database was created through the Neon platform, and its connection string was configured in the NestJS application.

The connection string is stored in:

```text
api/.env
```

The Prisma datasource reads the connection string using the `DATABASE_URL` environment variable.

Example configuration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

The actual credentials must remain private.

### Environment Variable Example

An `.env.example` file is included to show which environment variables are required without exposing database credentials.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

The actual `.env` file is excluded from version control through `.gitignore`.

## 6. Prisma Configuration

Prisma ORM was integrated into the NestJS application using Prisma 6.19.0.

The Prisma schema is located at:

```text
api/prisma/schema.prisma
```

The datasource is configured to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The Prisma Client generator is configured as follows:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

Prisma Client provides the application with a type-safe interface for interacting with the database.

## 7. Database Schema and Models

The database consists of five main models and one enum:

1. Role
2. User
3. Genre
4. Book
5. Review

### 7.1 Role Enum

The Role enum defines the types of users supported by the system.

```prisma
enum Role {
  PATRON
  LIBRARIAN
}
```

- `PATRON`: A regular library user.
- `LIBRARIAN`: A user with library management responsibilities.

Using an enum ensures that the role field accepts only predefined values.

### 7.2 User Model

The User model represents people registered in the library system.

It contains:

- `id`: Unique identifier.
- `name`: User's name.
- `email`: Unique email address.
- `role`: User's role.
- `reviews`: Reviews created by the user.
- `createdAt`: Account creation timestamp.

The role defaults to `PATRON`.

The unique constraint on email prevents duplicate user accounts with the same email address.

### 7.3 Genre Model

The Genre model represents book categories.

It contains:

- `id`: Unique identifier.
- `name`: Genre name.
- `slug`: Unique URL-friendly identifier.
- `books`: Related books.

The `name` and `slug` fields are unique.

Four initial genres were created:

- Fiction
- Science
- History
- Technology

### 7.4 Book Model

The Book model represents books stored in the library.

It contains:

- `id`: Unique identifier.
- `title`: Book title.
- `author`: Book author.
- `isbn`: Unique book identification number.
- `totalCopies`: Total number of copies.
- `availableCopies`: Number of available copies.
- `genreId`: Foreign key referencing Genre.
- `genre`: Relationship to the Genre model.
- `reviews`: Reviews associated with the book.

The `totalCopies` and `availableCopies` fields default to 1.

The ISBN field is unique to prevent duplicate book identifiers.

### 7.5 Review Model

The Review model represents feedback submitted by users about books.

It contains:

- `id`: Unique identifier.
- `rating`: Numerical rating.
- `comment`: Optional written feedback.
- `bookId`: Foreign key referencing Book.
- `userId`: Foreign key referencing User.
- `createdAt`: Review creation timestamp.

A compound unique constraint is defined on `bookId` and `userId`.

This prevents the same user from submitting multiple reviews for the same book.

Rating validation, such as restricting values to 1–5, should also be implemented in application logic.

## 8. Database Relationships

The database uses relational modeling to connect its entities.

### 8.1 Genre and Book Relationship

A Genre can contain multiple Books, while each Book belongs to one Genre.

This is a one-to-many relationship.

The relationship is implemented using:

```prisma
model Genre {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  books Book[]
}
```

The Book model contains:

```prisma
genreId Int
genre   Genre @relation(fields: [genreId], references: [id])
```

The `genreId` field is the foreign key.

### 8.2 User and Review Relationship

A User can create multiple Reviews, while each Review belongs to one User.

### 8.3 Book and Review Relationship

A Book can receive multiple Reviews, while each Review belongs to one Book.

Together, these relationships establish the foundation for a book review system.

## 9. Schema Decisions

### Why does Book reference Genre instead of embedding the genre name?

The Book model uses a foreign key called `genreId` to reference the Genre model rather than storing the genre name directly in every book record.

This decision follows relational database design principles.

**1. Avoiding data duplication**

If every book stored its own genre name, values such as "Science" would be repeated across many records.

This creates unnecessary duplication.

**2. Maintaining data consistency**

With a separate Genre table, each genre has one authoritative record.

If a genre name changes, it can be updated once instead of modifying every associated book.

**3. Enforcing referential integrity**

The foreign key ensures that each book references an existing genre.

The database can therefore prevent a book from referencing a nonexistent genre.

**4. Making queries and filtering easier**

Books can be retrieved and filtered by genre through their relationship.

For example, the application can retrieve all books belonging to the Science genre without duplicating genre information.

**Conclusion:** Separating Genre and Book creates a normalized relational structure that is easier to maintain, extend and query.

## 10. Database Migration

After defining the Prisma schema, the database was migrated to Neon PostgreSQL.

The schema was first validated:

```bash
npx prisma validate
```

The initial migration was then created and applied:

```bash
npx prisma migrate dev --name init
```

This generated the migration history and created the database tables based on the Prisma schema.

The migration workflow ensures that database structure changes are tracked and reproducible.

Migrations should be committed to version control so that other developers can recreate the database structure.

For production deployment, existing migrations should generally be applied using:

```bash
npx prisma migrate deploy
```

## 11. Database Seeding

A seed script was created at:

```text
api/prisma/seed.ts
```

The purpose of the seed script is to insert initial data into the database.

### Initial Genre Data

Four genres were inserted:

| Genre | Slug |
|---|---|
| Fiction | fiction |
| Science | science |
| History | history |
| Technology | technology |

The script uses Prisma `upsert()` to create genres when they do not exist and update their names when they do.

### Initial Book Data

Sixteen books were inserted, distributed evenly across the four genres.

| Genre | Number of books |
|---|---:|
| Fiction | 4 |
| Science | 4 |
| History | 4 |
| Technology | 4 |
| **Total** | **16** |

The script dynamically obtains the genre IDs and assigns the appropriate `genreId` to each book.

It uses `createMany()` with `skipDuplicates: true` to avoid inserting duplicate records when the seed script is executed again.

### Running the Seed Script

The seed script was executed using:

```bash
npx prisma db seed
```

The command completed without reporting an error.

### Seed Verification

Prisma Studio was used to inspect the database after seeding.

The following records were confirmed:

- 4 Genre records.
- 16 Book records.

The database contents were successfully verified.

## 12. NestJS Architecture

NestJS organizes backend applications using modules, controllers and providers.

This project uses the following components:

### AppModule

`app.module.ts` is the root module of the application.

It imports PrismaModule and registers the original AppController and AppService.

### AppController

The AppController is responsible for handling incoming HTTP requests.

It was preserved from the initial NestJS project scaffolding.

### AppService

The AppService contains the original application service logic.

It was also preserved from the initial NestJS project scaffolding.

### PrismaService

PrismaService provides the database connection and Prisma Client functionality.

### PrismaModule

PrismaModule registers PrismaService and makes it available to the application.

## 13. PrismaService and Dependency Injection

The PrismaService is located at:

```text
api/src/prisma/prisma.service.ts
```

It extends PrismaClient and implements NestJS's OnModuleInit lifecycle interface.

Its responsibilities include:

- Providing Prisma Client functionality.
- Establishing the database connection.
- Connecting when the NestJS application starts.

The service uses:

```typescript
await this.$connect();
```

inside its `onModuleInit()` method.

This allows NestJS to initialize the database connection as part of its application startup process.

### Dependency Injection

Dependency injection is a design pattern used by NestJS to manage dependencies.

Instead of creating a separate PrismaClient instance inside every service, the application registers PrismaService as a provider.

Other application services can then request PrismaService through constructor injection.

This improves code reuse, maintainability and testability.

## 14. PrismaModule Integration

The PrismaModule is located at:

```text
api/src/prisma/prisma.module.ts
```

It registers PrismaService as a provider and exports it.

The module uses the `@Global()` decorator so that other modules can access PrismaService without repeatedly importing PrismaModule.

The AppModule imports PrismaModule, making the database integration part of the main application architecture.

## 15. Prisma ORM vs Document Databases

This project uses PostgreSQL, which is a relational database.

Relational databases organize information into tables with defined relationships.

For example:

- Genre stores categories.
- Book stores book information.
- User stores registered users.
- Review connects users to books.

A document database, such as MongoDB, stores information in flexible document structures, often using JSON-like formats.

### Key Differences

| Feature | Relational Database | Document Database |
|---|---|---|
| Structure | Tables and rows | Documents and collections |
| Relationships | Foreign keys | References or embedded documents |
| Schema | Usually structured | More flexible |
| Data consistency | Strong relational constraints | Depends on design and configuration |
| Querying | SQL or ORM queries | Document-oriented queries |

### Why PostgreSQL was selected

PostgreSQL is appropriate for this project because library data contains clear relationships.

For example, a book belongs to a genre, and a review belongs to both a user and a book.

These relationships are naturally represented using relational tables and foreign keys.

Prisma makes these relationships easier to define and manage through its schema language.

## 16. Security Considerations

The following security practices were considered:

- Database credentials are stored in `.env`.
- The `.env` file is excluded from Git through `.gitignore`.
- `.env.example` provides a template without exposing real credentials.
- Unique constraints protect important fields such as email and ISBN.
- Foreign keys maintain relationships between database records.

Real database credentials should never be committed to a public repository.

## 17. Installation and Setup

### Prerequisites

Before running the application, ensure the following are installed:

- Node.js
- npm
- PostgreSQL database hosted on Neon
- Git

### Step 1: Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd library-management-system
```

Replace `YOUR_REPOSITORY_URL` with the actual repository URL.

### Step 2: Navigate to the API directory

```bash
cd api
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure environment variables

Create an `.env` file inside the `api` directory.

Add your Neon PostgreSQL connection string:

```env
DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING"
```

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

### Step 6: Apply database migrations

For a fresh development database with migration files available:

```bash
npx prisma migrate dev
```

### Step 7: Seed the database

```bash
npx prisma db seed
```

### Step 8: Start the application

```bash
npm run start:dev
```

The NestJS development server should start and initialize PrismaService.

## 18. Useful Commands

Run these commands from the `api` directory.

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run start:dev` | Start NestJS in development mode |
| `npx prisma validate` | Validate the Prisma schema |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev --name init` | Create and apply an initial migration |
| `npx prisma migrate deploy` | Apply existing migrations |
| `npx prisma db seed` | Execute the seed script |
| `npx prisma studio` | Open the visual database interface |

## 19. Testing and Verification

The following implementation checks were completed:

1. Prisma schema validation completed without errors.
2. The initial database migration was run.
3. PrismaService was configured to connect during NestJS initialization.
4. PrismaModule was created and registered in AppModule.
5. The NestJS development application started without reporting an error.
6. The seed command completed without reporting an error.
7. Prisma Studio confirmed that four genres existed.
8. Prisma Studio confirmed that sixteen books existed.

These checks demonstrate that the database foundation and Prisma integration are functioning.

## 20. Future Improvements

The current implementation establishes the database foundation. Further development could include:

- Creating BooksController and BooksService.
- Implementing CRUD operations for books.
- Implementing genre filtering and book searches.
- Creating user registration and authentication.
- Implementing librarian and patron permissions.
- Creating book borrowing and return functionality.
- Implementing review creation and rating validation.
- Adding pagination and sorting.
- Adding automated tests.
- Implementing API documentation with Swagger.

## 21. Conclusion

The Library Management System demonstrates the integration of NestJS, PostgreSQL and Prisma ORM.

The project establishes a relational database structure with users, genres, books and reviews.

It also demonstrates database migrations, seed scripts, foreign key relationships, NestJS modules, dependency injection and database connection management.

The initial database was successfully populated and verified using Prisma Studio, confirming four genres and sixteen books.

This implementation provides a foundation for developing a complete library management backend.

## 8.1 Authentication and Authorization

- `POST /auth/register` creates a PATRON account and returns a JWT.
- `POST /auth/login` verifies a bcrypt password and returns a JWT.
- JWT bearer tokens are validated by `JwtStrategy` and `JwtAuthGuard`.
- `RolesGuard` restricts librarian mutations to users whose JWT role is `LIBRARIAN`.
- Public registration cannot select a librarian role.
- Set `JWT_SECRET` in `api/.env` for local and production deployments.

## 8.2 Catalog API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/genres` | Public | List genres |
| GET | `/genres/:id` | Public | Read one genre and its books |
| POST | `/genres` | Librarian | Create a genre |
| PATCH | `/genres/:id` | Librarian | Update a genre |
| DELETE | `/genres/:id` | Librarian | Delete a genre |
| GET | `/books` | Public | Filter/search/paginate/sort books |
| GET | `/books/:id` | Public | Read one book |
| POST | `/books` | Librarian | Create a book |
| PATCH | `/books/:id` | Librarian | Update a book |
| DELETE | `/books/:id` | Librarian | Delete a book |

Book list query parameters: `genreId`, `search`, `page`, `limit`, and `sort` (`title` or `author`).

The API uses global `ValidationPipe` transformation/whitelisting and CORS for Vite development origins.

## 8.3 Seed Librarian

Set `SEED_LIBRARIAN_PASSWORD` in `api/.env`, then run:

```bash
cd api
npm run prisma:seed
```

The seed command requires `SEED_LIBRARIAN_PASSWORD`; it does not use a default password.

Seeded account:

- Email: `librarian@example.com`
- Role: `LIBRARIAN`

## 8.4 Postman Collection

Import `postman/library-management-system.postman_collection.json`, set `baseUrl` to `http://localhost:3000`, login with the librarian account, and set the collection `token` variable before protected requests.
