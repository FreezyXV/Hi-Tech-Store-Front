import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/navbar.css';

import logoSearch from '../assets/logos/loupe.png';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`); 
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        name="searchInput"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-input"
      />
      <button type="submit" className="search-bar-button">
        <img src={logoSearch} alt="Search" className="search-bar-logo" />
      </button>
    </form>
  );
};

export default SearchBar;
