# 📘 Fullstack Quiz App – Monorepo Implementation Plan (Updated)

## 1. Overview

Fullstack quiz platform:

- Backend: Node.js (MVC)
- Database: MongoDB
- Frontend: Admin + Quiz (separate repos, React)

---

## 2. Database Structure (MongoDB)

### Collections & Schema

| Collection | Field | Type | Description |
|-----------|------|------|-------------|
| users | _id | ObjectId | Primary key |
| users | email | String | User email |
| users | password | String | Hashed password |
| users | role | String | admin / user |
| users | createdAt | Date | Created time |
| quizzes | _id | ObjectId | Primary key |
| quizzes | title | String | Quiz title |
| quizzes | description | String | Description |
| quizzes | createdBy | ObjectId | Ref to user |
| quizzes | createdAt | Date | Created time |
| questions | _id | ObjectId | Primary key |
| questions | quizId | ObjectId | Ref to quiz |
| questions | question | String | Question text |
| questions | type | String | single / multiple |
| questions | options | Array<String> | Answer options |
| questions | correctAnswers | Array<Number> | Correct indexes |
| attempts | _id | ObjectId | Primary key |
| attempts | userId | ObjectId | Ref to user |
| attempts | quizId | ObjectId | Ref to quiz |
| attempts | answers | Array | User answers |
| attempts | score | Number | Final score |
| attempts | createdAt | Date | Attempt time |

---

## 3. Repository Structure

### Backend

```
quiz-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   └── app.js
```

### Frontend

Admin & Quiz separated.

---

## 4. Backend Design

- MVC pattern
- JWT authentication
- Excel import via XLSX
- File upload using Multer

---

## 5. Excel Import

Columns:

Question | Type | Option1 | Option2 | Option3 | Option4 | CorrectAnswers

---

## 6. Frontend Stack

- React
- TanStack Router
- TanStack Query
- Axios
- TailwindCSS
- i18n (EN/VI)
- Dark mode

---

## 7. Environment Variables

Backend:

PORT=5000  
MONGO_URI=  
JWT_SECRET=  

Frontend:

VITE_API_URL=http://localhost:5000/api

---

## 8. Security

- Store secrets in .env
- Validate inputs
- Protect routes

---

## 9. Deployment

- Backend: Docker
- DB: MongoDB Atlas
- Frontend: Vercel

---

## 10. Timeline

| Week | Task |
|------|------|
| 1 | Auth + Setup |
| 2 | Quiz APIs |
| 3 | Admin UI |
| 4 | Quiz UI |
| 5 | Excel Import |
| 6 | Deploy |

---

## ✅ Completed Plan
