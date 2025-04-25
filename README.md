🚀 SkillShare Backend - Spring Boot + MongoDB
This is the backend for the SkillShare Platform — a social learning and content-sharing platform where users can create posts, learning plans, like, comment, follow others, and receive notifications.

Built using:

Java 21

Spring Boot 3.4.4

MongoDB

JWT Authentication

Maven

📦 Main Features
✅ User Authentication (Register/Login)
✅ JWT-based Secure APIs
✅ User Profile Management (View, Update, Delete)
✅ Follow / Unfollow Users
✅ Create, View, Update, Delete Posts (with Media Upload)
✅ Like / Unlike Posts
✅ Add / Edit / Delete Comments on Posts
✅ Create Personalized Learning Plans
✅ Assign Meal Plans to Users
✅ Real-time Notifications for Likes, Follows, and Comments
✅ Clean REST API following Best Practices

🏗️ Project Structure
css
Copy
Edit
src/main/java/com/skillshare/
├── config/         (Security + CORS)
├── controller/     (All REST endpoints)
├── dto/            (Data Transfer Objects)
├── exception/      (Error Handling)
├── model/          (MongoDB Models)
├── repository/     (MongoDB Repositories)
├── security/       (JWT Auth Logic)
├── service/        (Business Logic)
└── SkillshareBackendApplication.java (Main App Starter)
