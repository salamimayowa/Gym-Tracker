# Gym Tracker - React Frontend

A modern, beautiful fitness tracking web application built with React, Vite, and TailwindCSS. Integrates seamlessly with the Spring Boot backend.

## 🚀 Features

- **Combined Auth Page**: Single page for both login and registration
- **Role-Based Access**: Support for USER and ADMIN roles
- **Dashboard**: Overview with stats and quick links
- **Session Management**: Book, view, edit, and delete workout sessions
- **Workout Logging**: Create and track workouts with exercise details
- **Available Sessions**: Find open time slots by date
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **JWT Authentication**: Secure token-based authentication

## 📋 Prerequisites

- Node.js 16+ and npm
- The Spring Boot backend running on `http://localhost:8080`

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Development Server

Start the dev server with hot reload and proxy to backend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with API requests proxied to `http://localhost:8080/api/v1`

### 3. Build for Production

Build the React app and output to Spring Boot static folder:

```bash
npm run build
```

This creates optimized production files in `src/main/resources/static/` which Spring Boot will serve.

### 4. Run with Spring Boot

After building, start the backend:

```bash
cd ..
mvn spring-boot:run
```

Access the app at `http://localhost:8080/`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── AuthPage.jsx          # Combined login/register
│   │   ├── Dashboard.jsx          # Main dashboard router
│   │   ├── Home.jsx              # Dashboard home with stats
│   │   ├── BookSession.jsx        # Book workout session
│   │   ├── ViewSessions.jsx       # View and manage sessions
│   │   ├── CreateWorkout.jsx      # Log workout exercises
│   │   └── AvailableSessions.jsx  # Find available times
│   ├── components/
│   │   └── Navbar.jsx             # Top navigation bar
│   ├── api.js                     # Axios API client
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # TailwindCSS styles
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # Dependencies & scripts
```

## 🔐 Authentication Flow

1. **Register**: User fills in full details (name, email, password, gender, DOB)
2. **Login**: User enters email and password
3. **JWT Token**: Token stored in `localStorage` and sent with every API request
4. **Auto-login**: After registration, user is automatically logged in

## 🎨 UI/UX Highlights

- **Gradient backgrounds** and modern color scheme
- **Responsive grid layouts** for all screen sizes
- **Interactive buttons** with hover effects and animations
- **Error handling** with clear user feedback
- **Loading states** to indicate pending operations
- **Emoji icons** for visual clarity and engagement
- **Card-based design** for organized information display

## 🔌 API Integration

The frontend integrates with these backend endpoints:

- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login (returns JWT token)
- `POST /api/v1/bookSession` - Book a workout session
- `GET /api/v1/view` - View user's sessions
- `PUT /api/v1/edit` - Edit session details
- `DELETE /api/v1/delete` - Delete a session
- `POST /api/v1/available` - Find available sessions by date
- `POST /api/v1/workout` - Create/log a workout

## 🚀 Performance Optimizations

- **Vite**: Lightning-fast dev server and optimized production build
- **Code splitting**: Automatic splitting of components
- **Tree shaking**: Unused code removed in production
- **Minification**: CSS and JavaScript minified
- **TailwindCSS PurgeCSS**: Only includes used styles

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Backend connection errors
- Ensure Spring Boot is running on `http://localhost:8080`
- Check `vite.config.js` proxy configuration
- Verify CORS settings in backend `SecurityConfig.java`

### Build output not updating Spring Boot
```bash
npm run build
mvn clean spring-boot:run
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

## 💡 Development Tips

- Use React DevTools browser extension for debugging
- Enable TailwindCSS IntelliSense in VS Code
- Keep components small and reusable
- Use `localStorage` for persistent state (tokens, preferences)

## 📝 License

This project is part of the Gym Tracker application.

---

**Happy Coding! 💪**
