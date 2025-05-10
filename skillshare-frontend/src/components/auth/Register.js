import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove confirmPassword since it's not needed in the API request
      const { confirmPassword, ...userData } = values;

      const result = await register(userData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center" style={{ padding: "50px" }}>
      <div className="col-md-6 col-lg-4" style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <div className="d-flex justify-content-center mb-4">
          <h2>Register</h2>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="firstname" className="form-label">First Name</label>
                <Field
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="form-control"
                  placeholder="Enter your first name"
                  style={{ padding: "10px", borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="firstname"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="lastname" className="form-label">Last Name</label>
                <Field
                  type="text"
                  id="lastname"
                  name="lastname"
                  className="form-control"
                  placeholder="Enter your last name"
                  style={{ padding: "10px", borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  style={{ padding: "10px", borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  style={{ padding: "10px", borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  style={{ padding: "10px", borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-danger"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
                style={{ padding: "12px", borderRadius: "8px" }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-3 text-center">
          <p>
            Already have an account? <Link to="/login" style={{ color: "#0066cc" }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
