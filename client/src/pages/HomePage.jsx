import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [genreError, setGenreError] = useState('');

  useEffect(() => {
    let ignore = false;

    axios
      .get(`${API_URL}/genres`)
      .then((response) => {
        if (!ignore) setGenres(response.data);
      })
      .catch(() => {
        if (!ignore) setGenreError('Could not load genres.');
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = useCallback((query) => setSearch(query), []);

  return (
    <main className="page">
      <header className="hero-section">
        <p className="eyebrow">Patron catalog</p>
        <h1>Find your next great read</h1>
        <p className="hero-copy">Browse the collection by genre or search for a title or author.</p>
      </header>

      <section className="catalog-controls" aria-label="Catalog filters">
        <SearchBar onSearch={handleSearch} />

        <label className="select-field">
          <span>Genre</span>
          <select value={genreId} onChange={(event) => setGenreId(event.target.value)}>
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="">Newest</option>
            <option value="title">Title A-Z</option>
            <option value="author">Author A-Z</option>
          </select>
        </label>
      </section>

      {genreError && <p className="inline-error">{genreError}</p>}
      <BookGrid genreId={genreId} search={search} sort={sort} />
    </main>
  );
}
