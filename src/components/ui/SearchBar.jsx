import { Search } from "lucide-react";

function SearchBar({ search, setSearch }) {

  return (
    <div className="search">

      <div className="search-box">

        <div className="search-field">

          <input
            className="input"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

        </div>

        <Search className="search-icon" />

      </div>

    </div>
  );
}

export default SearchBar;