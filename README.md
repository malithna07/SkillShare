# SkillShare Backend

A complete backend system for SkillShare — a social learning and content-sharing platform.

---

## 🚀 Built With
- Java 21
- Spring Boot 3.4.4
- MongoDB
- JWT Authentication
- Maven

---

## 📚 Main Features
- 🔐 User Authentication (Register/Login)
- 🗁️ JWT-based Secure API Protection
- 👤 User Profile Management (View, Update, Delete)
- 🤝 Follow / Unfollow Users
- 📝 Create, Update, Delete Posts (with Media Upload)
- ❤️ Like / Unlike Posts
- 💬 Add, Edit, Delete Comments
- 📚 Create and Manage Personalized Meal Plans
- 🔔 Real-time Notifications (Like / Comment / Follow)
- 🛠️ Clean REST API Structure following Best Practices

---

## 📂 Project Structure
```
src/main/java/com/skillshare/
├── config/         (Security, CORS setup)
├── controller/     (All REST endpoints)
├── dto/            (Data Transfer Objects for API)
├── exception/      (Global Exception Handling)
├── model/          (MongoDB Data Models)
├── repository/     (MongoDB Access Repositories)
├── security/       (JWT Authentication Filters & Utils)
├── service/        (Business Logic)
└── SkillshareBackendApplication.java (Application Starter)
```

---

## 🛠️ How to Run Locally
1. Clone the repository
2. Update `application.properties` with your MongoDB connection details and JWT secret
3. Build and start the server:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Server will start at:
   ```
   http://localhost:8080
   ```

---

## 🧪 Postman API Testing
- **Authentication** (Register/Login)
- **User Profile Management**
- **Post CRUD + Media Upload**
- **Likes and Comments**
- **Meal Plans**
- **Notifications**

Postman collection available separately.

---

## 🤝 Contribution
Pull requests and improvements are welcome!  
This project is intended for learning, practicing REST API backend development, and understanding secure full-stack application setups.

---


Thank you for visiting the project! 🎉

