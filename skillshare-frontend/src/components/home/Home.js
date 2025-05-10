import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostService from "../../services/PostService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faComment,
  faImage,
  faTimes,
  faEllipsisH,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const Home = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await PostService.getAllPosts();
      setPosts(response.data.posts);

      const uniqueUserIds = [
        ...new Set(response.data.posts.map((post) => post.userId)),
      ];
      await loadUserData(uniqueUserIds);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    try {
      const userMap = { ...users };
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      for (const userId of userIds) {
        if (userMap[userId]) continue;

        try {
          const response = await axios.get(
            `http://localhost:8080/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data && response.data.user) {
            userMap[userId] = response.data.user;
          }
        } catch (err) {
          console.error(`Failed to load user ${userId}:`, err);
        }
      }
      setUsers(userMap);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview("");
    }
  };

  const clearFileSelection = () => {
    setFile(null);
    setPreview("");
    const fileInput = document.getElementById("post-image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !file) {
      setError("Please add some content or an image to your post.");
      return;
    }

    try {
      setSubmitting(true);
      await PostService.createPost(currentUser.id, content, file);
      setContent("");
      setFile(null);
      setPreview("");
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await PostService.likePost(postId, currentUser.id);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, likedUserIds: [...post.likedUserIds, currentUser.id] }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await PostService.unlikePost(postId, currentUser.id);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedUserIds: post.likedUserIds.filter(
                  (id) => id !== currentUser.id
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      const options = { day: "numeric", month: "short" };
      if (date.getFullYear() !== now.getFullYear()) {
        options.year = "numeric";
      }
      return date.toLocaleDateString(undefined, options);
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

  return (
    <div className="content-container">
      <div className="feed-container">
        {/* Create Post Card */}
        <div className="modern-card create-post-card">
          <div className="modern-card-body">
            {error && (
              <div className="error-alert">
                {error}
                <button
                  className="error-close-btn"
                  onClick={() => setError("")}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="create-post-header">
                <div className="avatar">
                  {currentUser?.profilePic ? (
                    <img
                      src={`http://localhost:8080/uploads/${currentUser.profilePic}`}
                      alt={`${currentUser.firstname}'s avatar`}
                    />
                  ) : (
                    <span>
                      {currentUser?.firstname?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <textarea
                  className="create-post-textarea"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="image-preview-container">
                  <img src={preview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={clearFileSelection}
                    className="image-close-btn"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="create-post-actions">
                <div className="create-post-options">
                  <label htmlFor="post-image" className="post-option-btn">
                    <FontAwesomeIcon icon={faImage} />
                    <span>Photo</span>
                  </label>
                  <input
                    type="file"
                    id="post-image"
                    className="hidden-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <button type="button" className="post-option-btn">
                    <FontAwesomeIcon icon={faSmile} />
                    <span>Feeling</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner-sm"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} />
                      Share
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="modern-card empty-state">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something interesting!</p>
          </div>
        ) : (
          posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => {
              const user = users[post.userId] || {
                firstname: "User",
                lastname: "",
              };
              const isLiked = post.likedUserIds.includes(currentUser?.id);

              return (
                <div key={post.id} className="modern-card post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="avatar">
                        {user.profilePic ? (
                          <img
                            src={`http://localhost:8080/uploads/${user.profilePic}`}
                            alt={`${user.firstname}'s avatar`}
                          />
                        ) : (
                          <span>{user.firstname.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="post-meta">
                        <Link
                          to={`/profile/${post.userId}`}
                          className="post-author-name"
                        >
                          {user.firstname} {user.lastname}
                        </Link>
                        <div className="post-time">
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </div>

                    {post.userId === currentUser?.id && (
                      <button className="post-more-btn">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </button>
                    )}
                  </div>

                  <div className="post-content">
                    {post.content && (
                      <p className="post-text">{post.content}</p>
                    )}

                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                      <div className="post-media">
                        <img
                          src={`http://localhost:8080/uploads/${post.mediaUrls[0]}`}
                          alt="Post media"
                        />
                      </div>
                    )}
                  </div>

                  <div className="post-footer">
                    <div className="post-actions">
                      <button
                        onClick={() =>
                          isLiked ? handleUnlike(post.id) : handleLike(post.id)
                        }
                        className={`post-action-btn ${isLiked ? "liked" : ""}`}
                      >
                        <FontAwesomeIcon
                          icon={isLiked ? solidHeart : regularHeart}
                        />
                        {post.likedUserIds.length > 0
                          ? post.likedUserIds.length
                          : ""}{" "}
                        {post.likedUserIds.length === 1 ? "Like" : "Likes"}
                      </button>

                      <Link to={`/post/${post.id}`} className="post-action-btn">
                        <FontAwesomeIcon icon={faComment} />
                        Comment
                      </Link>
                    </div>

                    <Link to={`/post/${post.id}`} className="view-details-link">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default Home;
