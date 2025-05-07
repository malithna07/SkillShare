import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationService from "../../services/NotificationService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faUser,
  faTrash,
  faBell,
  faClock,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Notifications.css";

const Notifications = () => {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications(
        currentUser.id
      );
      setNotifications(response.data.notifications);

      // Load user data for all notification senders
      const senderIds = [
        ...new Set(
          response.data.notifications.map(
            (notification) => notification.senderId
          )
        ),
      ];
      await loadUserData(senderIds);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    try {
      const userMap = { ...users };
      for (const userId of userIds) {
        // Skip if we already have this user's data
        if (userMap[userId]) continue;

        try {
          const response = await UserService.getUserById(userId);
          userMap[userId] = response.data.user;
        } catch (err) {
          console.error(`Failed to load user ${userId}:`, err);
          // Continue with other users even if one fails
        }
      }
      setUsers(userMap);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMilliseconds = now - date;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <FontAwesomeIcon icon={faHeart} />;
      case "comment":
        return <FontAwesomeIcon icon={faComment} />;
      case "follow":
        return <FontAwesomeIcon icon={faUser} />;
      default:
        return <FontAwesomeIcon icon={faBell} />;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "like":
      case "comment":
        return `/post/${notification.postId}`;
      case "follow":
        return `/profile/${notification.senderId}`;
      default:
        return "#";
    }
  };

  const getNotificationAction = (type) => {
    switch (type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "interacted with you";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">Notifications</h2>
        {notifications.length > 0 && (
          <span className="notifications-count">{notifications.length}</span>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <div className="empty-notifications-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <p className="empty-notifications-text">
            You have no notifications yet.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const sender = users[notification.senderId] || {
              firstname: "User",
              lastname: "",
            };
            const notificationLink = getNotificationLink(notification);

            return (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.read ? "unread" : ""
                }`}
              >
                <div className="notification-content">
                  <div className={`notification-icon ${notification.type}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-body">
                    <div className="notification-text">
                      <Link
                        to={`/profile/${notification.senderId}`}
                        className="notification-username"
                      >
                        {sender.firstname} {sender.lastname}
                      </Link>{" "}
                      <span className="notification-message">
                        {notification.message ||
                          getNotificationAction(notification.type)}
                      </span>
                    </div>
                    <Link to={notificationLink} className="notification-link">
                      View {notification.type === "follow" ? "profile" : "post"}
                      <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        className="ms-1"
                        size="xs"
                      />
                    </Link>
                    <div className="notification-time">
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button
                      className="delete-notification-button"
                      onClick={(e) =>
                        handleDeleteNotification(notification.id, e)
                      }
                      aria-label="Delete notification"
                      title="Delete notification"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
