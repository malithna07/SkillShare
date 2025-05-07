import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import PostDetail from "./components/posts/PostDetail";
import Notifications from "./components/notifications/Notifications";
import MealPlans from "./components/mealplans/MealPlans";
import MealPlanDetail from "./components/mealplans/MealPlanDetail";
import CreateMealPlan from "./components/mealplans/CreateMealPlan";
import EditMealPlan from "./components/mealplans/EditMealPlan";
import Navigation from "./components/common/Navigation";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />
              
              {/* Profile routes - specific routes first */}
              <Route
                path="/profile/edit"
                element={<ProtectedRoute element={<EditProfile />} />}
              />
              <Route
                path="/profile/:id"
                element={<ProtectedRoute element={<Profile />} />}
              />
              
              <Route
                path="/post/:id"
                element={<ProtectedRoute element={<PostDetail />} />}
              />
              
              <Route
                path="/notifications"
                element={<ProtectedRoute element={<Notifications />} />}
              />
              
              {/* Meal plan routes - specific routes first */}
              <Route
                path="/mealplans/create"
                element={<ProtectedRoute element={<CreateMealPlan />} />}
              />
              <Route
                path="/mealplans/edit/:id"
                element={<ProtectedRoute element={<EditMealPlan />} />}
              />
              <Route
                path="/mealplans/:id"
                element={<ProtectedRoute element={<MealPlanDetail />} />}
              />
              <Route
                path="/mealplans"
                element={<ProtectedRoute element={<MealPlans />} />}
              />

              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
