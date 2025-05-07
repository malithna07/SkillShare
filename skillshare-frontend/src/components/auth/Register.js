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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#333",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Create an Account
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffe6e6",
              color: "#d32f2f",
              padding: "0.8rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "0.95rem",
            }}
          >
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
              {["firstname", "lastname", "email", "password", "confirmPassword"].map(
                (fieldName, idx) => (
                  <div key={idx} style={{ marginBottom: "1rem" }}>
                    <label
                      htmlFor={fieldName}
                      style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
                    >
                      {fieldName === "confirmPassword"
                        ? "Confirm Password"
                        : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </label>
                    <Field
                      type={fieldName.toLowerCase().includes("password") ? "password" : "text"}
                      id={fieldName}
                      name={fieldName}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                      }}
                    />
                    <ErrorMessage
                      name={fieldName}
                      component="div"
                      style={{ color: "#d32f2f", fontSize: "0.85rem", marginTop: "0.3rem" }}
                    />
                  </div>
                )
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  marginTop: "1rem",
                  backgroundColor: isSubmitting ? "#6cb2eb" : "#007bff",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.95rem",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;