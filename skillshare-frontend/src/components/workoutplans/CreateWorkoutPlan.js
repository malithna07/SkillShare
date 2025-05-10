import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanService from "../../services/WorkoutPlanService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateWorkoutPlan = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "Planned",
    exercises: [""],
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (index, value) => {
    const updated = [...formData.exercises];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const addExercise = () => {
    setFormData((prev) => ({ ...prev, exercises: [...prev.exercises, ""] }));
  };

  const removeExercise = (index) => {
    const updated = [...formData.exercises];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workoutData = {
        ...formData,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      await WorkoutPlanService.createPlan(workoutData);
      navigate("/workoutplans");
    } catch (err) {
      console.error(err);
      setError("Failed to create workout plan.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        to="/workoutplans"
        style={{
          textDecoration: "none",
          marginBottom: "1rem",
          display: "inline-block",
          color: "#4f46e5",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Plans
      </Link>
      <h2 style={{ fontWeight: 600, marginBottom: "1rem" }}>Create Workout Plan</h2>
      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "0.75rem",
            borderLeft: "4px solid #dc2626",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            rows={4}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", marginTop: "0.25rem" }}
          >
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Exercises</label>
          {formData.exercises.map((exercise, idx) => (
            <div key={idx} style={{ display: "flex", marginBottom: "0.5rem" }}>
              <input
                type="text"
                value={exercise}
                onChange={(e) => handleExerciseChange(idx, e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "0.5rem",
                }}
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeExercise(idx)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addExercise}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#4f46e5",
              color: "#fff",
              border: "none",
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Exercise
          </button>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: "bold",
            border: "none",
            marginTop: "1rem",
          }}
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreateWorkoutPlan;
