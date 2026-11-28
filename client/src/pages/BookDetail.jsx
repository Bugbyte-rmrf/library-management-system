import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchBook() {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_URL}/books/${id}`);
        if (!ignore) setBook(response.data);
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || 'Could not load this book.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchBook();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <main className="page status-message">Loading book details...</main>;
  if (error) return (
    <main className="page status-message error">
      {error}
      <Link className="back-link" to="/">Back to catalog</Link>
    </main>
  );

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/">← Back to catalog</Link>

      <article className="book-detail">
        <div className="detail-cover" aria-hidden="true">
          {book.coverImage ? <img src={book.coverImage} alt="" /> : <span>{book.title.charAt(0)}</span>}
        </div>

        <div className="detail-content">
          <span className="genre-pill">{book.genre?.name ?? 'Uncategorized'}</span>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          <p className="detail-description">{book.description}</p>

          <dl className="book-facts">
            <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>
            <div><dt>Availability</dt><dd>{book.availableCopies} of {book.totalCopies} copies</dd></div>
            <div><dt>Reviews</dt><dd>{book.reviews?.length ?? 0}</dd></div>
          </dl>
        </div>
      </article>
    </main>
  );
}
