import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const EditProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    loadUserData();
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserById(currentUser.id);
      setUser(response.data.user);

      if (response.data.user.profilePic) {
        setPreview(
          `http://localhost:8080/uploads/${response.data.user.profilePic}`
        );
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load your profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    bio: Yup.string().max(250, "Bio must be 250 characters or less"),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Update user profile - For now just handle basic fields
      // In a real app, you'd need to handle uploading the profile picture too
      await UserService.updateUser(currentUser.id, {
        firstname: values.firstname,
        lastname: values.lastname,
        bio: values.bio,
        profilePic: user.profilePic, // Since we don't handle file upload in this implementation
      });

      navigate(`/profile/${currentUser.id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  if (!user) {
    return (
      <div className="content-container">
        <div className="error-alert">{error || "User profile not found"}</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="edit-profile-container">
        <div className="page-header">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <h2 className="section-title">Edit Profile</h2>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="modern-card">
          <div className="modern-card-body">
            <Formik
              initialValues={{
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                bio: user.bio || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="profile-pic-preview"
                      />
                    ) : (
                      <div className="profile-pic-placeholder">
                        {user.firstname.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="upload-btn-wrapper">
                        <button type="button" className="btn-outline-primary">
                          <FontAwesomeIcon
                            icon={faImage}
                            style={{ marginRight: "0.5rem" }}
                          />
                          Change Photo
                        </button>
                        <input
                          type="file"
                          id="profile-image"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      <p
                        className="text-muted"
                        style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}
                      >
                        Note: Profile image update is not implemented in this
                        demo
                      </p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstname" className="form-label">
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="firstname"
                      name="firstname"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      style={{
                        color: "#ef4444",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastname" className="form-label">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="lastname"
                      name="lastname"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      style={{
                        color: "#ef4444",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio" className="form-label">
                      Bio
                    </label>
                    <Field
                      as="textarea"
                      id="bio"
                      name="bio"
                      rows="4"
                      className="form-control"
                      placeholder="Tell others about yourself..."
                    />
                    <ErrorMessage
                      name="bio"
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
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-sm"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} />
                        Save Changes
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
