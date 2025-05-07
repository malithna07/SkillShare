import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUtensils,
  faUser,
  faSignOutAlt,
  faHome,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Sidebar navigation style
  return (
    <>
      {/* Mobile Navigation Header - only visible on small screens */}
      <div className="mobile-nav-header">
        <h1 className="app-title">SkillShare</h1>
        <button className="menu-toggle-btn" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar-nav ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="app-title">SkillShare</h1>
            <button className="close-sidebar-btn" onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {isAuthenticated ? (
            <div className="sidebar-menu">
              <NavItem
                to="/"
                icon={faHome}
                text="Home"
                active={isActive("/")}
                onClick={toggleMobileMenu}
              />
              <NavItem
                to="/notifications"
                icon={faBell}
                text="Notifications"
                active={isActive("/notifications")}
                onClick={toggleMobileMenu}
              />
              <NavItem
                to="/mealplans"
                icon={faUtensils}
                text="Meal Plans"
                active={isActive("/mealplans")}
                onClick={toggleMobileMenu}
              />
              {currentUser && (
                <NavItem
                  to={`/profile/${currentUser.id}`}
                  icon={faUser}
                  text="Profile"
                  active={location.pathname.includes(
                    `/profile/${currentUser.id}`
                  )}
                  onClick={toggleMobileMenu}
                />
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="sidebar-link"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
                <span className="sidebar-text">Logout</span>
              </button>

              {/* User Avatar in Sidebar */}
              {currentUser && (
                <div className="sidebar-user">
                  <div className="sidebar-avatar">
                    {currentUser.profilePic ? (
                      <img
                        src={`http://localhost:8080/uploads/${currentUser.profilePic}`}
                        alt={`${currentUser.firstname}'s avatar`}
                      />
                    ) : (
                      <span>
                        {currentUser.firstname?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="sidebar-username">
                    {currentUser.firstname} {currentUser.lastname}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="sidebar-menu">
              <NavItem
                to="/login"
                icon={faUser}
                text="Login"
                active={isActive("/login")}
                onClick={toggleMobileMenu}
              />
              <NavItem
                to="/register"
                icon={faUser}
                text="Register"
                active={isActive("/register")}
                onClick={toggleMobileMenu}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Overlay when sidebar is open on mobile */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

// Sidebar navigation item
const NavItem = ({ to, icon, text, active, onClick }) => {
  return (
    <Link
      to={to}
      className={`sidebar-link ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="sidebar-icon" />
      <span className="sidebar-text">{text}</span>
    </Link>
  );
};

export default Navigation;
