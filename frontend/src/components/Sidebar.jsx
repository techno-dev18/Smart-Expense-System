import { NavLink } from "react-router-dom";

import "../styles/sidebar.css";

function Sidebar() {
  const getNavClass = ({ isActive }) => {
    return isActive
      ? "sidebar-link sidebar-link-active"
      : "sidebar-link";
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-header">

        <h2>
          Smart<span>Expense</span>
        </h2>

        <p>
          Financial Manager
        </p>

      </div>


      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className={getNavClass}
        >
          <span className="sidebar-icon">
            ▦
          </span>

          <span>
            Dashboard
          </span>
        </NavLink>


        <NavLink
          to="/expenses"
          className={getNavClass}
        >
          <span className="sidebar-icon">
            ↓
          </span>

          <span>
            Expenses
          </span>
        </NavLink>


        <NavLink
          to="/income"
          className={getNavClass}
        >
          <span className="sidebar-icon">
            ↑
          </span>

          <span>
            Income
          </span>
        </NavLink>


        <NavLink
          to="/budget"
          className={getNavClass}
        >
          <span className="sidebar-icon">
            ₹
          </span>

          <span>
            Budget
          </span>
        </NavLink>


        <NavLink
          to="/analytics"
          className={getNavClass}
        >
          <span className="sidebar-icon">
            ◫
          </span>

          <span>
            Analytics
          </span>
        </NavLink>


        <div className="sidebar-divider" />


        <NavLink
          to="/profile"
          className={getNavClass}
        >
          <span className="sidebar-icon">
            ●
          </span>

          <span>
            Profile
          </span>
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;