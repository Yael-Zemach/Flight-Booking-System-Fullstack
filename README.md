# Flight Booking System Fullstack

A full-stack flight reservation platform built to simplify the travel booking experience for customers and streamline operations for administrators. The application enables users to search for flights, compare one-way and round-trip options, create bookings, and manage reservations, while giving admins a secure dashboard to manage flights, airports, and customer bookings.

This project combines a modern React frontend with a scalable Express and MySQL backend, implementing role-based access, seat availability logic, secure authentication, and real-time notifications in a production-style architecture.

## Key Features

- User authentication and registration with JWT-based authorization
- Customer flight search with one-way and round-trip support
- Flexible search logic for near-matching travel dates when exact availability is unavailable
- Booking flow with passenger details, fare totals, and payment simulation
- Booking history and individual reservation detail pages for customers
- Admin dashboard for managing flights, airports, user searches, and bookings
- Airport management with image upload support and administrative controls
- Seat reservation tracking and automatic cleanup of expired pending bookings
- Real-time communication support using Socket.IO for live updates and notification handling
- Protected routes and role-based access for customer and admin workflows

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router DOM, CSS Modules / Custom CSS |
| Backend | Node.js, Express 5, JWT, bcrypt, CORS, Multer |
| Real-time Communication | Socket.IO |
| Database | MySQL |
| API & Data Handling | REST APIs, MySQL2, dotenv |
| Security | Password hashing, JWT verification, protected routes |
| Dev Workflow | npm, Vite, Git |

## Architecture & Project Structure

The application follows a clear client-server architecture:

- Frontend: React app handles all user interactions, search flows, booking forms, and admin screens
- Backend: Express API manages business logic, authentication, validation, and database operations
- Database: MySQL stores users, airports, flights, passengers, and booking records
- Real-time layer: Socket.IO supports live updates and notification scenarios

```text
Flight-Booking-System-Fullstack/
├── backend/
│   ├── db/
│   │   ├── init_db.sql
│   │   └── schema_db.sql
│   └── server/
│       ├── config/
│       │   └── database.js
│       ├── constants/
│       │   ├── apiRoutes.js
│       │   ├── errorCodes.js
│       │   ├── jwtConfig.js
│       │   ├── messages.js
│       │   └── ...
│       ├── controllers/
│       │   ├── airportsController.js
│       │   ├── authController.js
│       │   ├── bookingsController.js
│       │   ├── flightsController.js
│       │   └── usersController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── uploadMiddleware.js
│       ├── models/
│       │   ├── airportsModel.js
│       │   ├── bookingsModel.js
│       │   ├── flightsModel.js
│       │   ├── passengersModel.js
│       │   └── usersModel.js
│       ├── routes/
│       │   ├── airportsRoutes.js
│       │   ├── authRoutes.js
│       │   ├── bookingRoutes.js
│       │   ├── flightsRoute.js
│       │   └── usersRoutes.js
│       ├── services/
│       │   ├── airportsService.js
│       │   ├── authService.js
│       │   ├── bookingsService.js
│       │   └── flightsService.js
│       ├── uploads/
│       ├── app.js
│       ├── package.json
│       └── .gitignore
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── API/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── Hooks/
│   │   ├── pages/
│   │   ├── style/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── README.md
├── .gitignore
└── README.md
```

## Getting Started / Local Setup

### Prerequisites

Before running the project locally, make sure you have the following installed:

- Node.js 18+ or 20+
- npm (comes with Node.js)
- MySQL 8.0+
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Flight-Booking-System-Fullstack
```

2. Set up the backend environment variables.

Create a `.env` file in `backend/server/` with the following values:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=flight_app
JWT_SECRET=your_super_secret_key
PORT=3000
```

3. Create the MySQL database and tables.

```bash
mysql -u root -p < backend/db/schema_db.sql
```

If preferred, you can also import the schema manually through MySQL Workbench or another database client.

4. Install backend dependencies:

```bash
cd backend/server
npm install
```

5. Install frontend dependencies:

```bash
cd ../../frontend
npm install
```

### Run the Project Locally

Start the backend server:

```bash
cd backend/server
npm start
```

Or run in development mode:

```bash
cd backend/server
npm run dev
```

Start the frontend app:

```bash
cd frontend
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

The backend API will run on:

```text
http://localhost:3000/api
```

## Future Improvements

- Integrate a production-grade payment system such as Stripe or PayPal for real booking payments
- Add advanced search filters, airline comparison tools, and richer analytics for business insights
- Expand test coverage with unit and integration tests, and add CI/CD automation for deployment validation
- Improve customer engagement with email notifications, booking reminders, and admin activity monitoring

## Summary

This project demonstrates a practical, full-stack software engineering workflow across frontend development, backend API design, database modeling, and secure application logic. It reflects a strong understanding of user-centric product design, business workflows, and the technical decisions required to build a modern travel booking application from end to end.
