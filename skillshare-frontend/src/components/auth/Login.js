import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-container">
      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontWeight: "600" }}>Login</h2>

        {error && (
          <div className="error-alert" style={{ marginBottom: "1rem" }}>
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
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                    fontSize: "1rem",
                  }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                    fontSize: "1rem",
                  }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="spinner-sm"
                      style={{ marginRight: "0.5rem" }}
                    ></div>
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--light-text)" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
