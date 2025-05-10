import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MealPlanService from "../../services/MealPlanService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUtensils,
  faCalendar,
  faUser,
  faEdit,
  faTrash,
  faPrint,
  faShare,
  faCircle,
  faList,
  faClipboardList,
  faInfoCircle,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import "./MealPlanDetail.css";

const MealPlanDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [mealPlan, setMealPlan] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMealPlanData();
  }, [id]);

  const loadMealPlanData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load meal plan details
      const planResponse = await MealPlanService.getPlanById(id);
      setMealPlan(planResponse.data.plan);

      // Load creator details
      const creatorId = planResponse.data.plan.userId;
      const creatorResponse = await UserService.getUserById(creatorId);
      setCreator(creatorResponse.data.user);
    } catch (error) {
      console.error("Error loading meal plan details:", error);
      setError(
        "Failed to load the meal plan. It might have been deleted or is unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this meal plan?")) {
      try {
        await MealPlanService.deletePlan(id);
        navigate("/mealplans");
      } catch (error) {
        console.error("Error deleting meal plan:", error);
        setError("Failed to delete the meal plan. Please try again.");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: mealPlan.title,
          text: `Check out this meal plan: ${mealPlan.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Copy this URL to share: " + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error || "Meal plan not found"}
        </div>
        <Link to="/mealplans" className="btn btn-primary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Meal Plans
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && mealPlan.userId === currentUser.id;

  // Parse topics if they're stored as a string
  const topics = Array.isArray(mealPlan.topics)
    ? mealPlan.topics
    : mealPlan.topics?.split(",").map((topic) => topic.trim()) || [];

  // Sample meal data structure - in a real app this would come from backend
  const mealData = {
    breakfast: {
      title: "High Protein Breakfast",
      ingredients: ["Eggs", "Chicken Breast", "Spinach", "Whole Grain Toast"],
      nutritionalInfo: {
        calories: 450,
        protein: 35,
        carbs: 30,
        fat: 15,
      },
    },
    lunch: {
      title: "Protein-Packed Lunch",
      ingredients: ["Chicken Breast", "Brown Rice", "Broccoli", "Olive Oil"],
      nutritionalInfo: {
        calories: 550,
        protein: 40,
        carbs: 45,
        fat: 15,
      },
    },
    dinner: {
      title: "Lean Dinner",
      ingredients: ["Lean Beef", "Sweet Potato", "Mixed Vegetables", "Avocado"],
      nutritionalInfo: {
        calories: 600,
        protein: 45,
        carbs: 40,
        fat: 20,
      },
    },
    snacks: {
      title: "Protein Snacks",
      ingredients: ["Greek Yogurt", "Almonds", "Protein Shake", "Apple"],
      nutritionalInfo: {
        calories: 350,
        protein: 30,
        carbs: 25,
        fat: 10,
      },
    },
  };

  return (
    <div className="meal-plan-container">
      {/* Header Section */}
      <div className="plan-header">
        <Link to="/mealplans" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Meal Plans
        </Link>

        <div className="action-buttons">
          <button className="btn-action" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
          <button className="btn-action" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} /> Share
          </button>
        </div>

        <h1>{mealPlan.title}</h1>

        <div className="creator-info">
          <div className="avatar">
            <div className="avatar-circle">
              {creator?.firstname?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <p>
              <FontAwesomeIcon icon={faUser} /> Created by:{" "}
              <strong>
                {creator
                  ? `${creator.firstname} ${creator.lastname}`
                  : "Unknown User"}
              </strong>
            </p>
          </div>
        </div>

        {mealPlan.deadline && (
          <div className="deadline-info">
            <FontAwesomeIcon icon={faCalendar} />
            <span>
              Deadline: {new Date(mealPlan.deadline).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="description-section">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faInfoCircle} /> Description
        </h3>
        <p>{mealPlan.description}</p>
      </div>

      {/* Topics Section */}
      {topics.length > 0 && (
        <div className="topics-section">
          <h3 className="section-title">
            <FontAwesomeIcon icon={faTag} /> Topics
          </h3>
          <div className="topics-list">
            {topics.map((topic, index) => (
              <span key={index} className="topic-tag">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meal Schedule Section */}
      <div className="meal-schedule">
        <div className="meal-schedule-header">
          <FontAwesomeIcon icon={faUtensils} />
          <h2>Daily Meal Schedule</h2>
        </div>

        {Object.entries(mealData).map(([mealType, data]) => (
          <div key={mealType} className="meal-section">
            <h3 className="meal-title">{mealType}</h3>
            <p className="meal-subtitle">{data.title}</p>

            <div className="ingredients">
              <h4>
                <FontAwesomeIcon icon={faList} /> Ingredients:
              </h4>
              <ul>
                {data.ingredients.map((ingredient, idx) => (
                  <li key={idx}>
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="ingredient-bullet"
                    />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="nutritional-information">
              <h4>
                <FontAwesomeIcon icon={faClipboardList} /> Nutritional
                Information:
              </h4>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-value">
                    {data.nutritionalInfo.calories}
                  </span>
                  <span className="nutrition-label">calories</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">
                    {data.nutritionalInfo.protein}g
                  </span>
                  <span className="nutrition-label">protein</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">
                    {data.nutritionalInfo.carbs}g
                  </span>
                  <span className="nutrition-label">carbs</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">
                    {data.nutritionalInfo.fat}g
                  </span>
                  <span className="nutrition-label">fat</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Owner Actions Section */}
      {isOwner && (
        <div className="owner-actions">
          <Link to={`/mealplans/edit/${mealPlan.id}`} className="btn-edit">
            <FontAwesomeIcon icon={faEdit} /> Edit
          </Link>
          <button className="btn-delete" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MealPlanDetail;
