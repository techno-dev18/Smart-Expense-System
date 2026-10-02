import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const SettingsMenu = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`settings-menu-wrapper ${
        open ? "settings-menu-open" : ""
      }`}
      ref={menuRef}
    >
      {open && (
        <div
          className="settings-menu-panel"
          role="menu"
          aria-label="Settings menu"
        >
          <div className="settings-menu-header">
            <div className="settings-menu-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="settings-menu-user">
              <strong>
                {user.name || "User"}
              </strong>

              <span>
                {user.email || ""}
              </span>
            </div>
          </div>

          <div className="settings-menu-divider" />

          <Link
            to="/profile"
            className="settings-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span
              className="settings-menu-icon"
              aria-hidden="true"
            >
              👤
            </span>

            <span>Profile</span>
          </Link>

          <Link
            to="/security"
            className="settings-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span
              className="settings-menu-icon"
              aria-hidden="true"
            >
              🔒
            </span>

            <span>Security & Data</span>
          </Link>

          <Link
            to="/privacy-policy"
            className="settings-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span
              className="settings-menu-icon"
              aria-hidden="true"
            >
              🛡️
            </span>

            <span>Privacy</span>
          </Link>

          <Link
            to="/accessibility"
            className="settings-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span
              className="settings-menu-icon"
              aria-hidden="true"
            >
              ♿
            </span>

            <span>Accessibility</span>
          </Link>

          <Link
            to="/faq"
            className="settings-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span
              className="settings-menu-icon"
              aria-hidden="true"
            >
              ❓
            </span>

            <span>Help & FAQ</span>
          </Link>

          <div className="settings-menu-divider" />

          <button
            type="button"
            className="settings-menu-item settings-menu-logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <span
              className="settings-menu-icon"
              aria-hidden="true"
            >
              ↪
            </span>

            <span>Logout</span>
          </button>
        </div>
      )}

      <button
  ref={buttonRef}
  id="settings-menu-button"
  type="button"
  className="settings-menu-button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          open
            ? "Close settings menu"
            : "Open settings menu"
        }
        aria-expanded={open}
        aria-haspopup="menu"
        title="Settings"
      >
        <span aria-hidden="true">
          ⚙
        </span>
      </button>
    </div>
  );
};

export default SettingsMenu;