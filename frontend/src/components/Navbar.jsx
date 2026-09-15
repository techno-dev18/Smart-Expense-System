import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();

    setMenuOpen(false);

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* Logo */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          Smart<span>Expense</span>
        </Link>

        {/* Mobile Menu Button */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        {/* Navigation */}

        <nav
          className={`navbar-links ${
            menuOpen
              ? "navbar-links-open"
              : ""
          }`}
        >

          {!user ? (
            <>
              <Link
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>

              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="navbar-signup"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
              >
                Dashboard
              </Link>

              <Link
                to="/expenses"
                onClick={closeMenu}
              >
                Expenses
              </Link>

              <Link
                to="/income"
                onClick={closeMenu}
              >
                Income
              </Link>

              <Link
                to="/budget"
                onClick={closeMenu}
              >
                Budget
              </Link>

              <Link
                to="/analytics"
                onClick={closeMenu}
              >
                Analytics
              </Link>
<Link
  to="/about"
  onClick={closeMenu}
>
  About
</Link>

<Link
  to="/contact"
  onClick={closeMenu}
>
  Contact
</Link>
              <Link
                to="/profile"
                onClick={closeMenu}
              >
                Profile
              </Link>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </nav>

      </div>

    </header>
  );
};

export default Navbar;