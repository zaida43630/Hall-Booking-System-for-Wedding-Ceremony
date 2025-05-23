# Wedding Hall Booking Management System

A MERN stack application for booking wedding halls.

## Features

- User authentication (register, login, logout)
- Browse available wedding halls
- Book halls for specific dates
- Process payments
- Manage bookings
- Admin dashboard for hall, booking, and user management
- Notifications system

## Tech Stack

- **Frontend**: React.js with Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

### Prerequisites

- Node.js
- MongoDB

### Setup

1. Clone the repository:
   \`\`\`
   git clone https://github.com/zaida43630/Hall-Booking-System-for-Wedding-Ceremony.git
   cd Hall-Booking-System-for-Wedding-Ceremony
   \`\`\`

2. Install server dependencies:
   \`\`\`
   cd server
   npm install
   \`\`\`

3. Install client dependencies:
   \`\`\`
   cd ../client
   npm install
   \`\`\`

4. Create a `.env` file in the server directory with the following variables:
   \`\`\`
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/wedding-hall-booking
   CLIENT_URL=http://localhost:5173
   \`\`\`

## Running the Application

1. Start the server:
   \`\`\`
   cd server
   npm run dev
   \`\`\`

2. Start the client:
   \`\`\`
   cd client
   npm run dev
   \`\`\`

3. Access the application at `http://localhost:5173`

## Admin Account

To create an admin account, you need to manually update a user's role in the database:

1. Register a new user through the application
2. Connect to your MongoDB database
3. Update the user's role to "admin":
   \`\`\`
   db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
   \`\`\`

