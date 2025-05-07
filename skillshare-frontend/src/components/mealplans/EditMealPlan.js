import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import MealPlanService from "../../services/MealPlanService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faTimes,
  faSave,
  faCalendarAlt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import "./MealPlanDetail.css"; // Using the existing CSS file for consistency

const EditMealPlan = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        const response = await MealPlanService.getPlanById(id);
        const fetchedMealPlan = response.data.plan;
        
        // Security check: Only allow users to edit their own meal plans
        if (fetchedMealPlan.userId !== currentUser?.id) {
          navigate("/mealplans");
          return;
        }

        setMealPlan(fetchedMealPlan);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
        setError("Failed to load meal plan data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [id, currentUser, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    deadline: Yup.date().nullable(),
    topics: Yup.array()
      .of(Yup.string().required("Topic cannot be empty"))
      .min(1, "At least one topic is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Filter out empty topics
      const updatedMealPlan = {
        ...values,
        topics: values.topics.filter(topic => topic.trim() !== "")
      };

      await MealPlanService.updatePlan(id, updatedMealPlan);
      navigate(`/mealplans/${id}`);
    } catch (error) {
      console.error("Error updating meal plan:", error);
      setError("Failed to update meal plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format the date for the input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="meal-plan-container loading-container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading meal plan...</p>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="meal-plan-container">
        <div className="error-message">
          <h3>Uh oh!</h3>
          <p>Meal plan not found or you don't have permission to edit it.</p>
          <Link to="/mealplans" className="back-link">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Meal Plans
          </Link>
        </div>
      </div>
    );
  }

  const initialValues = {
    title: mealPlan.title || "",
    description: mealPlan.description || "",
    deadline: formatDateForInput(mealPlan.deadline),
    topics: mealPlan.topics && mealPlan.topics.length > 0 
      ? mealPlan.topics 
      : [""],
  };

  return (
    <div className="meal-plan-container">
      <Link to={`/mealplans/${id}`} className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Meal Plan
      </Link>
      
      <div className="edit-plan-content">
        <h1 className="edit-plan-title">Edit Meal Plan</h1>

        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}

        <div className="edit-form-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, isSubmitting }) => (
              <Form className="edit-plan-form">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Title</label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter meal plan title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">Description</label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Describe your meal plan"
                    rows="5"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline" className="form-label">
                    <FontAwesomeIcon icon={faCalendarAlt} className="icon-space-right" />
                    Deadline (Optional)
                  </label>
                  <Field
                    type="date"
                    id="deadline"
                    name="deadline"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="deadline"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faTags} className="icon-space-right" />
                    Topics
                  </label>
                  <FieldArray name="topics">
                    {({ push, remove }) => (
                      <div className="topics-container">
                        {values.topics.map((topic, index) => (
                          <div key={index} className="topic-input-group">
                            <div className="topic-input-wrapper">
                              <Field
                                type="text"
                                name={`topics.${index}`}
                                className="form-control topic-input"
                                placeholder="Enter a topic"
                              />
                              {index > 0 && (
                                <button
                                  type="button"
                                  className="remove-topic-button"
                                  onClick={() => remove(index)}
                                  title="Remove topic"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              )}
                            </div>
                            <ErrorMessage
                              name={`topics.${index}`}
                              component="div"
                              className="form-error"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-topic-button"
                          onClick={() => push("")}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add Topic
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="button-spinner"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <Link 
                    to={`/mealplans/${id}`} 
                    className="cancel-button"
                  >
                    Cancel
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditMealPlan;
