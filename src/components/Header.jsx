
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
} from "lucide-react";

export default function Header({
  darkMode,
  setDarkMode,
  setOpen,
}) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="icon-button mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={21} />
        </button>

        <div className="breadcrumb">
          Dashboard <span>/</span> Overview
        </div>
      </div>

      <div className="header-right">
        <div className="search-box">
          <Search size={17} />
          <input placeholder="Search anything..." />
          <span>⌘ K</span>
        </div>

        <button
          className="icon-button"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button className="icon-button notification">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="header-avatar">IA</div>
      </div>
    </header>
  );
}
