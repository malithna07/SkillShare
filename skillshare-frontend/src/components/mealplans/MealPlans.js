import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MealPlanService from "../../services/MealPlanService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUtensils,
  faCalendar,
  faUser,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const MealPlans = () => {
  const { currentUser } = useAuth();

  const [mealPlans, setMealPlans] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    try {
      setLoading(true);
      const response = await MealPlanService.getAllPlans();
      setMealPlans(response.data.plans);

      // Load user data for all meal plan creators
      const userIds = [
        ...new Set(response.data.plans.map((plan) => plan.userId)),
      ];
      await loadUserData(userIds);
    } catch (error) {
      console.error("Error loading meal plans:", error);
      setError("Failed to load meal plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    try {
      const userMap = { ...users };
      for (const userId of userIds) {
        // Skip if we already have this user's data
        if (userMap[userId]) continue;

        try {
          const response = await UserService.getUserById(userId);
          userMap[userId] = response.data.user;
        } catch (err) {
          console.error(`Failed to load user ${userId}:`, err);
          // Continue with other users even if one fails
        }
      }
      setUsers(userMap);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const getFilteredMealPlans = () => {
    if (activeTab === "my") {
      return mealPlans.filter((plan) => plan.userId === currentUser.id);
    }
    return mealPlans;
  };

  if (loading) {
    return (
      <div
        className="content-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  const filteredPlans = getFilteredMealPlans();

  return (
    <div className="content-container">
      <div className="meal-plan-container">
        <div
          className="page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2>Meal Plans</h2>
            <p className="text-muted">
              Discover and share meal plans with the community
            </p>
          </div>
          <Link to="/mealplans/create" className="btn-primary create-plan-btn">
            <FontAwesomeIcon icon={faPlus} />
            Create Plan
          </Link>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div
          style={{
            borderBottom: "1px solid var(--border-color)",
            marginBottom: "1.5rem",
          }}
        >
          <button
            className={`tab-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
            style={{
              background: "none",
              border: "none",
              padding: "0.75rem 1rem",
              marginRight: "1rem",
              fontWeight: activeTab === "all" ? "600" : "400",
              color:
                activeTab === "all"
                  ? "var(--primary-color)"
                  : "var(--text-color)",
              borderBottom:
                activeTab === "all" ? "2px solid var(--primary-color)" : "none",
              cursor: "pointer",
            }}
          >
            All Plans
          </button>
          <button
            className={`tab-button ${activeTab === "my" ? "active" : ""}`}
            onClick={() => setActiveTab("my")}
            style={{
              background: "none",
              border: "none",
              padding: "0.75rem 1rem",
              fontWeight: activeTab === "my" ? "600" : "400",
              color:
                activeTab === "my"
                  ? "var(--primary-color)"
                  : "var(--text-color)",
              borderBottom:
                activeTab === "my" ? "2px solid var(--primary-color)" : "none",
              cursor: "pointer",
            }}
          >
            My Plans
          </button>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="modern-card empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No meal plans found</h3>
            <p>
              {activeTab === "all"
                ? "There are no meal plans available yet."
                : "You haven't created any meal plans yet."}
            </p>
          </div>
        ) : (
          <div>
            {filteredPlans.map((plan) => {
              const creator = users[plan.userId] || {
                firstname: "User",
                lastname: "",
              };

              return (
                <div
                  key={plan.id}
                  className="modern-card"
                  style={{ marginBottom: "1rem" }}
                >
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                      {plan.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "var(--light-text)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                      <span>
                        Created by {creator.firstname} {creator.lastname}
                      </span>
                    </div>

                    {plan.deadline && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.875rem",
                          color: "var(--light-text)",
                          marginBottom: "1rem",
                        }}
                      >
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <span>
                          Deadline:{" "}
                          {new Date(plan.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <p style={{ marginBottom: "1rem" }}>
                      {plan.description || "Weekly high-protein plan"}
                    </p>

                    {plan.topics && plan.topics.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {plan.topics.map((topic, index) => (
                          <span
                            key={index}
                            style={{
                              background: "var(--sidebar-hover)",
                              color: "var(--text-color)",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <FontAwesomeIcon icon={faUtensils} />
                            {topic}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <span
                          style={{
                            background: "var(--sidebar-hover)",
                            color: "var(--text-color)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FontAwesomeIcon icon={faUtensils} />
                          Chicken
                        </span>
                        <span
                          style={{
                            background: "var(--sidebar-hover)",
                            color: "var(--text-color)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FontAwesomeIcon icon={faUtensils} />
                          Eggs
                        </span>
                        <span
                          style={{
                            background: "var(--sidebar-hover)",
                            color: "var(--text-color)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FontAwesomeIcon icon={faUtensils} />
                          Lentils
                        </span>
                      </div>
                    )}

                    <Link
                      to={`/mealplans/${plan.id}`}
                      className="btn-outline-primary"
                      style={{
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlans;
