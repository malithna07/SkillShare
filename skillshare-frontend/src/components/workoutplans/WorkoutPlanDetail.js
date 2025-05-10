import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanService from "../../services/WorkoutPlanService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faCalendarDays,
  faEdit,
  faTrash,
  faCircleCheck,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const WorkoutPlanDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await WorkoutPlanService.getPlanById(id);
      const planData = res.data;
      setPlan(planData);

      const userRes = await UserService.getUserById(planData.userId);
      setUser(userRes.data.user);
    } catch (err) {
      console.error(err);
      setError("Workout plan not found.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await WorkoutPlanService.deletePlan(id);
        navigate("/workoutplans");
      } catch (err) {
        setError("Failed to delete the plan.");
      }
    }
  };

  const renderStatus = (status) => {
    let icon;
    switch (status) {
      case "Planned":
        icon = faClock;
        break;
      case "In Progress":
        icon = faCircleCheck;
        break;
      case "Completed":
        icon = faCheckCircle;
        break;
      default:
        icon = faClock;
    }
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
          padding: "0.3rem 0.6rem",
          fontSize: "0.85rem",
          borderRadius: "6px",
        }}
      >
        <FontAwesomeIcon icon={icon} />
        {status}
      </span>
    );
  };

  if (error)
    return (
      <div
        style={{
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          padding: "0.75rem",
          borderLeft: "4px solid #dc2626",
          borderRadius: "5px",
          margin: "1rem auto",
          maxWidth: "700px",
        }}
      >
        {error}
      </div>
    );

  if (!plan) return <div style={{ padding: "2rem" }}>Loading...</div>;

  const isOwner = currentUser?.id === plan.userId;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        to="/workoutplans"
        style={{
          textDecoration: "none",
          color: "#4f46e5",
          display: "inline-block",
          marginBottom: "1rem",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Plans
      </Link>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontWeight: 600, fontSize: "1.75rem", marginBottom: "0.75rem" }}>{plan.title}</h2>
        <p style={{ marginBottom: "0.5rem", color: "#4b5563" }}>
          <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }} />
          {user?.firstname} {user?.lastname}
        </p>
        {plan.deadline && (
          <p style={{ marginBottom: "0.5rem", color: "#4b5563" }}>
            <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: "0.5rem" }} />
            Deadline: {new Date(plan.deadline).toLocaleDateString()}
          </p>
        )}
        <p style={{ marginBottom: "1rem" }}>
          <strong>Status: </strong> {renderStatus(plan.status)}
        </p>

        <p style={{ color: "#374151", marginBottom: "1rem" }}>{plan.description}</p>
        <hr style={{ margin: "1rem 0" }} />

        <h4 style={{ marginBottom: "1rem", fontWeight: "500" }}>Exercises</h4>
        {plan.exercises?.length > 0 ? (
          <ul style={{ paddingLeft: "1rem", marginBottom: "1rem" }}>
            {plan.exercises.map((ex, idx) => (
              <li
                key={idx}
                style={{
                  listStyle: "disc",
                  marginBottom: "0.5rem",
                  color: "#1f2937",
                }}
              >
                {ex}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#9ca3af" }}>No exercises listed.</p>
        )}

        {isOwner && (
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <Link
              to={`/workoutplans/edit/${plan.id}`}
              style={{
                backgroundColor: "#4f46e5",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanDetail;
