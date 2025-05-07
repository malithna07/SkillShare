import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import MealPlanService from "../../services/MealPlanService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const CreateMealPlan = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const initialValues = {
    title: "",
    description: "",
    deadline: "",
    topics: [""],
  };

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
      // Format the data for API submission
      const mealPlanData = {
        ...values,
        userId: currentUser.id,
        createdAt: new Date(),
      };

      // Filter out any empty topics
      mealPlanData.topics = mealPlanData.topics.filter(
        (topic) => topic.trim() !== ""
      );

      await MealPlanService.createPlan(mealPlanData);
      navigate("/mealplans");
    } catch (error) {
      console.error("Error creating meal plan:", error);
      setError("Failed to create meal plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="d-flex align-items-center mb-4">
            <Link to="/mealplans" className="btn btn-outline-secondary me-3">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Meal Plans
            </Link>
            <h2 className="mb-0">Create Meal Plan</h2>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="card shadow-sm">
            <div className="card-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
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
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        className="form-control"
                        placeholder="Describe your meal plan"
                        rows="4"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="deadline" className="form-label">
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
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Topics</label>
                      <FieldArray name="topics">
                        {({ push, remove }) => (
                          <div>
                            {values.topics.map((topic, index) => (
                              <div key={index} className="d-flex mb-2">
                                <div className="flex-grow-1 me-2">
                                  <Field
                                    type="text"
                                    name={`topics.${index}`}
                                    className="form-control"
                                    placeholder="Enter a topic"
                                  />
                                  <ErrorMessage
                                    name={`topics.${index}`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </button>
                                )}
                              </div>
                            ))}

                            <button
                              type="button"
                              className="btn btn-outline-primary mt-2"
                              onClick={() => push("")}
                            >
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Topic
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creating...
                          </>
                        ) : (
                          "Create Meal Plan"
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMealPlan;
