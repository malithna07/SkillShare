import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUtensils,
  faUser,
  faSignOutAlt,
  faHome,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", icon: faHome, text: "Home" },
    { to: "/notifications", icon: faBell, text: "Notifications" },
    { to: "/mealplans", icon: faUtensils, text: "Meal Plans" },
    { to: "/workoutplans", icon: faDumbbell, text: "Workout Plans" },
    currentUser && {
      to: `/profile/${currentUser.id}`,
      icon: faUser,
      text: "Profile",
    },
  ].filter(Boolean);

  return (
    <nav
      style={{
        width: "220px",
        height: "100vh",
        borderRight: "1px solid #e5e7eb",
        padding: "1.5rem 1rem",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", color: "#4f46e5" }}>SkillShare</h2>

        {isAuthenticated &&
          links.map(({ to, icon, text }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: isActive(to) ? "600" : "normal",
                backgroundColor: isActive(to) ? "#eef2ff" : "transparent",
                color: isActive(to) ? "#4f46e5" : "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              <FontAwesomeIcon icon={icon} />
              <span>{text}</span>
            </Link>
          ))}
      </div>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "none",
            border: "none",
            color: "#ef4444",
            fontWeight: 500,
            padding: "0.5rem",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navigation;
