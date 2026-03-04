import { useState, useEffect } from "react";
import Board from "./components/board/Board";
import ThemeToggle from "./components/ui/ThemeToggle";
import SearchBar from "./components/ui/SearchBar";
import ProfileAvatar from "./components/ui/ProfileAvatar";
import "./styles/global.css";

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const [search, setSearch] = useState("");

  function toggleTheme(){
    setDarkMode(!darkMode);
  }

  useEffect(()=>{
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  },[darkMode]);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>

      <header className="header">

        <h1>Kanban Board</h1>

        <div className="header-actions">

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <ThemeToggle
            darkMode={darkMode}
            toggleTheme={toggleTheme}
          />

          <ProfileAvatar />

        </div>

      </header>

      <main className="layout">
        <Board search={search} />
      </main>

    </div>
  );
}

export default App;