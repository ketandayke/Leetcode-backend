# Problem Management Microservice 🚀

A robust, type-safe microservice built with **Node.js** and **TypeScript** to manage coding challenges, test cases, and problem metadata for a LeetCode-style platform.

## 🏗️ Architecture & Patterns
This service follows **Domain-Driven Design (DDD)** principles and a **Layered Architecture**:

- **Controller Layer:** Handles HTTP requests and responses.
- **Service Layer (The Brain):** Contains business logic, sanitization, and error handling. Uses **Dependency Injection** for better testability.
- **Repository Layer:** Manages database operations (MongoDB) using the **Repository Pattern**.
- **Validation Layer:** Implements **Zod** for runtime schema validation and Type-Safe DTOs.

## 🛠️ Key Features
- **TypeScript & Type Safety:** 100% type coverage across the service, repository, and models.
- **Custom Error Handling:** Centralized error middleware with custom classes (`AppError`, `BadRequestError`, `NotFoundError`).
- **Markdown Sanitization:** Secure pipeline using `marked`, `sanitize-html`, and `turndown` to prevent XSS attacks in problem descriptions.
- **Advanced Search:** Multi-field search (Title/Description) using MongoDB Case-Insensitive Regex.
- **DTOs (Data Transfer Objects):** Separate schemas for creating and updating problems to ensure data integrity.

## 🚦 API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/problems` | Create a new challenge |
| `GET` | `/api/v1/problems` | Fetch all problems (Sorted by latest) |
| `GET` | `/api/v1/problems/:id` | Get details of a specific problem |
| `PUT` | `/api/v1/problems/:id` | Update partial problem data |
| `DELETE` | `/api/v1/problems/:id` | Remove a problem |
| `GET` | `/api/v1/problems/search` | Search problems by title/description |

## 💻 Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Validation:** Zod
- **Logging:** Winston