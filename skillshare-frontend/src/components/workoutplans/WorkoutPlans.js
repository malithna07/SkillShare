// File: components/workoutplans/WorkoutPlans.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanService from "../../services/WorkoutPlanService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDumbbell,
  faUser,
  faCalendarDays,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

const WorkoutPlans = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await WorkoutPlanService.getAllPlans();
      setPlans(response.data);
      const userIds = [...new Set(response.data.map(p => p.userId))];
      await loadUserData(userIds);
    } catch (err) {
      setError("Failed to load workout plans.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    const userMap = { ...users };
    for (const id of userIds) {
      if (!userMap[id]) {
        const res = await UserService.getUserById(id);
        userMap[id] = res.data.user;
      }
    }
    setUsers(userMap);
  };

  const filteredPlans =
    activeTab === "my"
      ? plans.filter(p => p.userId === currentUser.id)
      : plans;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
            <FontAwesomeIcon icon={faDumbbell} style={{ marginRight: "0.5rem" }} />
            Workout Plans
          </h2>
          <p style={{ color: "#6c757d", marginTop: "0.25rem" }}>
            Explore and manage your fitness routines
          </p>
        </div>
        <Link
          to="/workoutplans/create"
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 500,
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "0.5rem" }} />
          Create Plan
        </Link>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          style={{
            padding: "0.4rem 1rem",
            border: "1px solid #4f46e5",
            borderRadius: "6px",
            fontWeight: 500,
            backgroundColor: activeTab === "all" ? "#4f46e5" : "white",
            color: activeTab === "all" ? "white" : "#4f46e5",
          }}
          onClick={() => setActiveTab("all")}
        >
          All Plans
        </button>
        <button
          style={{
            padding: "0.4rem 1rem",
            border: "1px solid #4f46e5",
            borderRadius: "6px",
            fontWeight: 500,
            backgroundColor: activeTab === "my" ? "#4f46e5" : "white",
            color: activeTab === "my" ? "white" : "#4f46e5",
          }}
          onClick={() => setActiveTab("my")}
        >
          My Plans
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            padding: "0.75rem",
            borderLeft: "4px solid #dc2626",
            borderRadius: "6px",
            color: "#dc2626",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#6c757d" }}>Loading workout plans...</div>
      ) : filteredPlans.length === 0 ? (
        <div
          style={{
            backgroundColor: "#eef2ff",
            padding: "0.75rem",
            borderLeft: "4px solid #4f46e5",
            borderRadius: "6px",
            color: "#4f46e5",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FontAwesomeIcon icon={faCircleInfo} />
          No workout plans found.
        </div>
      ) : (
        <div>
          {filteredPlans.map(plan => {
            const user = users[plan.userId] || { firstname: "User", lastname: "" };
            return (
              <div
                key={plan.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div style={{ padding: "1.25rem" }}>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {plan.title}
                    {plan.status && (
                      <span
                        style={{
                          backgroundColor: "#dbeafe",
                          color: "#1d4ed8",
                          fontSize: "0.75rem",
                          padding: "0.3em 0.6em",
                          borderRadius: "4px",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {plan.status}
                      </span>
                    )}
                  </h4>
                  <p style={{ marginBottom: "0.3rem", color: "#4b5563" }}>
                    <FontAwesomeIcon icon={faUser} className="me-2" /> {user.firstname} {user.lastname}
                  </p>
                  {plan.deadline && (
                    <p style={{ marginBottom: "0.5rem", color: "#4b5563" }}>
                      <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Deadline:{" "}
                      {new Date(plan.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ marginBottom: "0.75rem", color: "#4b5563" }}>{plan.description}</p>
                  <Link
                    to={`/workoutplans/${plan.id}`}
                    style={{
                      padding: "0.3rem 0.8rem",
                      fontSize: "0.85rem",
                      borderRadius: "4px",
                      border: "1px solid #4f46e5",
                      backgroundColor: "white",
                      color: "#4f46e5",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans;
