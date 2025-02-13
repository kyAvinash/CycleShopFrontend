import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <form onSubmit={handleSearch} className="d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Search cycles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="btn btn-outline-light">
        Search
      </button>
    </form>
  );
};

export default Search;