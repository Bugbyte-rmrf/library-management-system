import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <label className="search-field">
      <span>Search the catalog</span>
      <input
        type="search"
        placeholder="Search by title or author..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </label>
  );
}
