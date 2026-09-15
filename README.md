# SmartExpense

SmartExpense is a full-stack personal finance management application that helps users track income, expenses, budgets, and financial analytics from a single dashboard.

The project combines a React frontend, Node.js/Express backend, MongoDB database, JWT authentication, and a C++ analytics engine.

---

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Expense management
  - Add expenses
  - Edit expenses
  - Delete expenses
  - Categorize expenses
- Income management
  - Add income
  - Edit income
  - Delete income
  - Categorize income
- Monthly budget management
- Budget usage tracking
- Budget overspending detection
- Financial dashboard
- Expense category analysis
- Monthly financial analysis
- Savings rate calculation
- Financial insights
- Budget recommendations
- C++ powered analytics engine
- Responsive frontend
- Error and loading states
- MongoDB persistence

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### Analytics Engine

- C++

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## Project Structure

```text
SmartExpense/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── cpp/
│   └── server.js
│
├── cpp-engine/
│   ├── include/
│   ├── src/
│   ├── input/
│   └── output/
│
├── README.md
└── .gitignore