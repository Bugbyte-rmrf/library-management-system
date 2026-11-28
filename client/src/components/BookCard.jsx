import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <article className="book-card">
      <div className="book-cover" aria-hidden="true">
        {book.coverImage ? (
          <img src={book.coverImage} alt="" />
        ) : (
          <span>{book.title.charAt(0)}</span>
        )}
      </div>

      <div className="book-card-content">
        <span className="genre-pill">{book.genre?.name ?? 'Uncategorized'}</span>
        <h2>{book.title}</h2>
        <p className="author">by {book.author}</p>
        <p className="copies">
          {book.availableCopies} of {book.totalCopies} copies available
        </p>
        <Link className="details-link" to={`/books/${book.id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
