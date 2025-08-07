# Planning Workout App

A full-stack workout planning application with user authentication, routine management, meal tracking, and workout entries.

## Features

- **User Authentication**: Secure signup, login, and logout functionality
- **Routine Management**: Create and manage workout routines
- **Meal Tracking**: Track your daily meals and nutrition
- **Workout Entries**: Log your workout sessions
- **User Profiles**: Personal profile management

## Fixed Authentication Issues

The following authentication problems have been resolved:

1. **API Endpoint Mismatch**: Fixed incorrect API endpoints in login and register components
2. **Form Validation**: Added comprehensive client-side and server-side validation
3. **Error Handling**: Improved error messages and user feedback
4. **Loading States**: Added loading indicators during authentication
5. **Logout Functionality**: Fixed logout button and added server-side logout endpoint
6. **Security**: Enhanced JWT token handling and cookie security

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd planning_workout
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:
```env
PORT=7700
NODE_ENV=development
MONGO=mongodb://localhost:27017/planning_workout
JWT=your-super-secret-jwt-key-change-this-in-production
```

### 3. Set up the client

```bash
cd ../client
npm install
```

## Running the Application

### Start the server
```bash
cd server
npm start
# or
node index.js
```

The server will run on `http://localhost:7700`

### Start the client
```bash
cd client
npm start
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Routines
- `GET /api/routines` - Get all routines
- `POST /api/routines` - Create new routine
- `PUT /api/routines/:id` - Update routine
- `DELETE /api/routines/:id` - Delete routine

### Meals
- `GET /api/meals` - Get all meals
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Entries
- `GET /api/entries` - Get all entries
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

## Authentication Flow

1. **Registration**: Users can register with username, email, and password
2. **Login**: Users authenticate with username and password
3. **JWT Token**: Server issues JWT token stored in HTTP-only cookie
4. **Protected Routes**: Client checks authentication state for protected routes
5. **Logout**: Clears token and redirects to landing page

## Validation Rules

### Registration
- Username: Minimum 3 characters, unique
- Email: Valid email format, unique
- Password: Minimum 6 characters
- Confirm Password: Must match password

### Login
- Username: Required
- Password: Required

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input validation and sanitization
- Error handling without exposing sensitive information

## Project Structure

```
planning_workout/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── authContext.js # Authentication context
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **Port Already in Use**: Change the PORT in .env file or kill the process using the port
3. **CORS Errors**: Check that the client URL is correctly configured in server CORS settings
4. **JWT Errors**: Ensure JWT_SECRET is set in environment variables

### Development Tips

- Use `nodemon` for automatic server restart during development
- Check browser console and server logs for debugging
- Use Postman or similar tool to test API endpoints
- Monitor MongoDB connections and queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 