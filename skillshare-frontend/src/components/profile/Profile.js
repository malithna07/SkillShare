import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faComment,
  faEdit,
  faUserPlus,
  faUserMinus,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");

      const userResponse = await UserService.getUserById(id);
      setUser(userResponse.data.user);

      await loadUserPosts();
      await loadFollowers();
      await loadFollowing();

      if (currentUser && followers.includes(currentUser.id)) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const allPostsResponse = await PostService.getAllPosts();
      const userPosts = allPostsResponse.data.posts.filter(
        (post) => post.userId === id
      );
      setPosts(userPosts);
    } catch (error) {
      console.error("Error loading user posts:", error);
    }
  };

  const loadFollowers = async () => {
    try {
      const response = await UserService.getFollowers(id);
      setFollowers(response.data.followers);
    } catch (error) {
      console.error("Error loading followers:", error);
    }
  };

  const loadFollowing = async () => {
    try {
      const response = await UserService.getFollowing(id);
      setFollowing(response.data.following);
    } catch (error) {
      console.error("Error loading following:", error);
    }
  };

  const handleFollow = async () => {
    try {
      await UserService.followUser(id, currentUser.id);
      setIsFollowing(true);
      setFollowers([...followers, currentUser.id]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await UserService.unfollowUser(id, currentUser.id);
      setIsFollowing(false);
      setFollowers(
        followers.filter((followerId) => followerId !== currentUser.id)
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
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

  if (error || !user) {
    return (
      <div className="content-container">
        <div className="error-alert">{error || "User not found"}</div>
      </div>
    );
  }

  const isOwnProfile = currentUser && id === currentUser.id;

  return (
    <div className="content-container">
      <div className="profile-container">
        <div className="modern-card profile-header-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              {user.profilePic ? (
                <img
                  src={`http://localhost:8080/uploads/${user.profilePic}`}
                  alt={`${user.firstname}'s profile`}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user.firstname.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="profile-name-actions">
                <h2 className="profile-name">
                  {user.firstname} {user.lastname}
                </h2>

                {isOwnProfile ? (
                  <Link
                    to="/profile/edit"
                    className="btn-outline-primary profile-action-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <>
                    {isFollowing ? (
                      <button
                        className="btn-outline-primary profile-action-btn"
                        onClick={handleUnfollow}
                      >
                        <FontAwesomeIcon icon={faUserMinus} />
                        <span>Unfollow</span>
                      </button>
                    ) : (
                      <button
                        className="btn-primary profile-action-btn"
                        onClick={handleFollow}
                      >
                        <FontAwesomeIcon icon={faUserPlus} />
                        <span>Follow</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">{followers.length}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">{following.length}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="section-title">Posts</h3>

        {posts.length === 0 ? (
          <div className="modern-card empty-state">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>This user hasn't shared anything yet.</p>
          </div>
        ) : (
          posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => {
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
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="post-time-icon"
                          />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </div>
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

export default Profile;
