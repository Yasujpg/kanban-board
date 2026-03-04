function ThemeToggle({ darkMode, toggleTheme }) {

  return (
    <div className="toggle-switch">
      <label className="switch-label">

        <input
          type="checkbox"
          className="checkbox"
          checked={darkMode}
          onChange={toggleTheme}
        />

        <span className="slider"></span>

      </label>
    </div>
  );
}

export default ThemeToggle;