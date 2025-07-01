# 📝 TodoList

This is a  **Todo List application** built using:

- 🔧 ASP.NET Core Web API (Backend)
- 💾 SQL Server + Entity Framework Core
- 🔐 Authentication & Authorization with Identity + JWT
- 🌐 Next.js (Frontend) + Tailwind CSS + ShadCN UI

---

## 🚀 Features

### ✅ Core Todo Features

- Add, edit, delete tasks
- Filter by status (Active, Completed)
- Sort by due date, priority, or title
- Search tasks by title or description
- Priority display (⭐ Low/Medium/High)

### 🔐 Authentication

- User Registration & Login (JWT-based)
- Token stored securely on the frontend
- Protected backend routes

---

## 🧱 Technologies Used

| Layer       | Tech Stack                                      |
|-------------|-------------------------------------------------|
| Frontend    | Next.js , TypeScript, Tailwind CSS, ShadCN UI |
| Backend     | ASP.NET Core, .NET SDK 9, Entity Framework Cor  |
| Auth        | ASP.NET Identity, JWT                           |
| Database    | SQL Server                                      |
| API Testing | Swagger UI (localhost:5109/swagger)             |
| Hosting     | Local (localhost:3000 / 5109)                   |

---

## ⚙️ How to Run Locally

```
-->Setup Backend (TodoListApi)
cd TodoListApi
dotnet run
Runs backend on https://localhost:5109

-->Setup Frontend (todolist-frontend folder)
cd ../todolist-frontend
npm install
npm run dev
Runs frontend on http://localhost:3000


