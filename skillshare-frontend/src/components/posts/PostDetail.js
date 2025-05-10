import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faEdit,
  faArrowLeft,
  faComment,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadPostData();
  }, [id]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      setError("");
      const postResponse = await PostService.getPostById(id);
      setPost(postResponse.data.post);
      setPostContent(postResponse.data.post.content);

      const authorId = postResponse.data.post.userId;
      const authorResponse = await UserService.getUserById(authorId);
      setAuthor(authorResponse.data.user);

      await loadComments();
    } catch (error) {
      console.error("Error loading post details:", error);
      setError(
        "Failed to load the post. It might have been deleted or is unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsResponse = await PostService.getComments(id);
      setComments(commentsResponse.data.comments);

      const commentUserIds = [
        ...new Set(
          commentsResponse.data.comments.map((comment) => comment.userId)
        ),
      ];
      await loadCommentUserData(commentUserIds);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadCommentUserData = async (userIds) => {
    try {
      const userMap = { ...commentUsers };
      for (const userId of userIds) {
        if (userMap[userId]) continue;

        try {
          const response = await UserService.getUserById(userId);
          userMap[userId] = response.data.user;
        } catch (err) {
          console.error(`Failed to load user ${userId}:`, err);
        }
      }
      setCommentUsers(userMap);
    } catch (error) {
      console.error("Error loading comment user data:", error);
    }
  };

  const handleLike = async () => {
    try {
      await PostService.likePost(id, currentUser.id);
      setPost({
        ...post,
        likedUserIds: [...post.likedUserIds, currentUser.id],
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      await PostService.unlikePost(id, currentUser.id);
      setPost({
        ...post,
        likedUserIds: post.likedUserIds.filter((uid) => uid !== currentUser.id),
      });
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      setSubmittingComment(true);
      await PostService.addComment(id, currentUser.id, commentText);
      setCommentText("");
      await loadComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await PostService.updateComment(commentId, editText);
      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, text: editText } : c))
      );
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await PostService.deleteComment(commentId);
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await PostService.deletePost(id);
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleEditPost = () => {
    setEditingPost(true);
  };

  const handleUpdatePost = async () => {
    try {
      await PostService.updatePost(id, postContent, file);
      setEditingPost(false);
      loadPostData(); // Reload post data after update
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="error-message">{error || "Post not found"}</div>
        <Link to="/" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Home
        </Link>
      </div>
    );
  }

  const isPostOwner = currentUser && post.userId === currentUser.id;
  const isLiked = post.likedUserIds.includes(currentUser.id);

  return (
    <div className="post-detail-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Feed
        </Link>

        {isPostOwner && (
          <>
            <button
              className="action-button"
              onClick={handleEditPost}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit Post
            </button>
            <button className="delete-post-button" onClick={handleDeletePost}>
              <FontAwesomeIcon icon={faTrash} /> Delete Post
            </button>
          </>
        )}
      </div>

      <div className="post-card">
        <div className="post-header">
          <div className="avatar-container">
            {author?.profilePic ? (
              <img
                src={`http://localhost:8080/uploads/${author.profilePic}`}
                alt={`${author.firstname}'s profile`}
                className="avatar"
              />
            ) : (
              <div className="avatar">
                {author?.firstname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <Link to={`/profile/${post.userId}`} className="username">
              {author?.firstname} {author?.lastname}
            </Link>
            <div className="post-date">
              <FontAwesomeIcon icon={faClock} className="me-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        <div className="post-content">
          {editingPost ? (
            <div>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpdatePost}>Save Changes</button>
              <button onClick={() => setEditingPost(false)}>Cancel</button>
            </div>
          ) : (
            <p>{post.content}</p>
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

        <div className="post-actions">
          <button
            className={`action-button ${isLiked ? "liked" : ""}`}
            onClick={() => (isLiked ? handleUnlike() : handleLike())}
          >
            <FontAwesomeIcon icon={faHeart} />
            {post.likedUserIds.length}{" "}
            {post.likedUserIds.length === 1 ? "Like" : "Likes"}
          </button>
        </div>
      </div>

      <div className="comment-section">
        <div className="comment-form-card">
          <div className="comment-form-header">Add a Comment</div>
          <div className="comment-form-body">
            <form onSubmit={handleAddComment}>
              <textarea
                className="comment-textarea"
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="submit-comment-button"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="comments-card">
          <div className="comments-header">
            <div>Comments</div>
            <div className="comments-count">{comments.length}</div>
          </div>
          <div className="comments-body">
            {comments.length === 0 ? (
              <p className="no-comments">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => {
                  const commentUser = commentUsers[comment.userId];
                  const isCommentOwner =
                    currentUser && comment.userId === currentUser.id;

                  return (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-header">
                        <div className="comment-avatar-container">
                          {commentUser?.profilePic ? (
                            <img
                              src={`http://localhost:8080/uploads/${commentUser.profilePic}`}
                              alt={`${commentUser.firstname}'s profile`}
                              className="comment-avatar"
                            />
                          ) : (
                            <div className="comment-avatar">
                              {commentUser?.firstname.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="comment-user-info">
                          <Link
                            to={`/profile/${comment.userId}`}
                            className="comment-username"
                          >
                            {commentUser?.firstname} {commentUser?.lastname}
                          </Link>
                          <div className="comment-date">
                            <FontAwesomeIcon icon={faClock} className="me-1" />
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>

                      {editingComment === comment.id ? (
                        <div className="comment-edit-form">
                          <textarea
                            className="comment-edit-textarea"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          ></textarea>
                          <div className="comment-edit-actions">
                            <button
                              className="comment-save-button"
                              onClick={() => handleUpdateComment(comment.id)}
                            >
                              Save
                            </button>
                            <button
                              className="comment-cancel-button"
                              onClick={() => setEditingComment(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="comment-body">{comment.text}</div>

                          {isCommentOwner && (
                            <div className="comment-actions">
                              <button
                                className="comment-action-button edit"
                                onClick={() => handleEditComment(comment)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                                Edit
                              </button>
                              <button
                                className="comment-action-button delete"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
