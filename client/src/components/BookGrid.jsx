import axios from 'axios';
import { useEffect, useState } from 'react';
import BookCard from './BookCard';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const PAGE_SIZE = 9;

export default function BookGrid({ genreId, search, sort }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [genreId, search, sort]);

  useEffect(() => {
    let ignore = false;

    async function fetchBooks() {
      setLoading(true);
      setError('');

      try {
        const params = { page, limit: PAGE_SIZE };
        if (genreId) params.genreId = genreId;
        if (search) params.search = search;
        if (sort) params.sort = sort;

        const response = await axios.get(`${API_URL}/books`, { params });
        if (!ignore) {
          setBooks(response.data.items);
          setTotalPages(response.data.meta.totalPages);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(
            requestError.response?.data?.message ||
              'Could not load the catalog. Make sure the API is running.',
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchBooks();
    return () => {
      ignore = true;
    };
  }, [genreId, search, sort, page]);

  if (loading) {
    return (
      <div className="status-grid" aria-live="polite">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="book-card skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (error) return <div className="status-message error">{error}</div>;
  if (books.length === 0) return <div className="status-message">No books match your filters.</div>;

  return (
    <>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Book pages">
          <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page === totalPages}>
            Next
          </button>
        </nav>
      )}
    </>
  );
}
