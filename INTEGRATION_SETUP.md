# Gym Tracker - Full Stack Setup Guide

Welcome to Gym Tracker! This guide will help you get both the React frontend and Spring Boot backend running smoothly.

## 📦 Project Structure

```
back-end-workout/
├── frontend/                          # React app (new)
│   ├── src/                          # React source files
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js               # Vite build config
│   └── README.md                     # Frontend documentation
├── src/
│   ├── main/
│   │   ├── java/                    # Spring Boot backend
│   │   └── resources/
│   │       └── static/              # Built frontend will go here
│   └── test/
├── pom.xml                           # Maven dependencies
└── INTEGRATION_SETUP.md              # This file
```

## 🚀 Quick Start (5 minutes)

### Option 1: Development Mode (Separate Frontend & Backend)

**Terminal 1 - Frontend Dev Server:**
```bash
cd frontend
npm install
npm run dev
```
Frontend will be at `http://localhost:5173`

**Terminal 2 - Spring Boot Backend:**
```bash
mvn spring-boot:run
```
Backend will be at `http://localhost:8080`

API requests from the frontend are automatically proxied to the backend.

### Option 2: Production Mode (Integrated)

**Build frontend:**
```bash
cd frontend
npm install
npm run build
```
This outputs the React app to `src/main/resources/static/`

**Run backend:**
```bash
cd ..
mvn clean spring-boot:run
```

Access the integrated app at `http://localhost:8080/`

## 📝 Setup Steps Explained

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs React, Vite, TailwindCSS, Axios, and other dependencies defined in `package.json`.

### 2. Environment Setup

**Development (.env not needed - uses defaults):**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- API base: `/api/v1` (proxied by Vite)

**Production (after build):**
- Everything served from `http://localhost:8080`
- Static files at `/`
- API at `/api/v1`

### 3. Frontend Development

Start with hot reload:
```bash
npm run dev
```

The app will auto-refresh as you edit files.

### 4. Build Frontend

Create optimized production build:
```bash
npm run build
```

Output goes to `src/main/resources/static/` for Spring Boot to serve.

### 5. Run Backend

```bash
mvn spring-boot:run
```

Or build JAR and run:
```bash
mvn clean package
java -jar target/GymTracker-0.0.1-SNAPSHOT.jar
```

## 🧪 Testing the Integration

### Test 1: Check Backend Health
```bash
curl http://localhost:8080/api/v1/dummy
# Expected: "yay, welcome!"
```

### Test 2: Register & Login
1. Go to `http://localhost:8080/` (or `http://localhost:5173` in dev mode)
2. Click "Sign Up"
3. Fill in registration form:
   - Full Name: John Doe
   - Username: johndoe
   - Email: john@example.com
   - Password: TestPass@123 (must include: uppercase, number, special char)
   - Gender: Male
   - DOB: 1990-01-01

### Test 3: Book a Session
1. After login, click "Book Session"
2. Select a date/time
3. Click "Book Session"

### Test 4: View Sessions
1. Click "Sessions" in navbar
2. Click "Refresh" to load your bookings

## 📱 Frontend Features

- ✅ **Combined Auth**: Login and register on one beautiful page
- ✅ **Dashboard**: Stats, quick links, motivational quotes
- ✅ **Session Management**: Book, view, edit, delete sessions
- ✅ **Workout Logging**: Create workouts with exercise details
- ✅ **Available Times**: Find open slots by date
- ✅ **Responsive**: Works on desktop, tablet, mobile
- ✅ **JWT Auth**: Secure token-based authentication
- ✅ **Error Handling**: Clear user feedback for errors
- ✅ **Loading States**: Visual feedback during API calls

## 🔐 Security Features

- **JWT Tokens**: Stored in `localStorage`, sent in `Authorization` header
- **Password Validation**: Min 8 chars, uppercase, number, special char
- **CORS Enabled**: Frontend can safely communicate with backend
- **Method Security**: `@PreAuthorize` on protected endpoints
- **Role-Based Access**: USER and ADMIN roles supported

## 🛠️ Available Scripts

### Frontend (from `frontend/` directory)

```bash
npm run dev           # Start dev server with hot reload
npm run build         # Build for production to ../src/main/resources/static
npm run preview       # Preview production build
npm run serve         # Build and serve on port 3000
```

### Backend (from root directory)

```bash
mvn clean install     # Build backend
mvn spring-boot:run   # Run backend
mvn test              # Run tests
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/register` - Register new user
- `POST /api/v1/login` - Login (returns JWT token)

### Sessions (require auth)
- `POST /api/v1/bookSession` - Book a workout session
- `GET /api/v1/view` - View your sessions
- `PUT /api/v1/edit` - Edit session
- `DELETE /api/v1/delete` - Delete session
- `POST /api/v1/available` - Find available sessions by date

### Workouts (require auth)
- `POST /api/v1/workout` - Create/log workout

### Admin (require ADMIN role)
- `GET /api/v1/generate-qr` - Generate QR code
- `GET /api/v1/report` - Get usage report

### Public
- `GET /api/v1/dummy` - Health check

## 🐛 Troubleshooting

### Frontend won't build
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Backend can't find frontend files
```bash
npm run build  # Make sure build is up to date
mvn clean spring-boot:run  # Clean rebuild
```

### Port 5173 already in use (dev mode)
```bash
npm run dev -- --port 3000
```

### JWT token errors
- Clear browser `localStorage` and re-login
- Check token format in browser DevTools Network tab
- Ensure `Authorization: Bearer <token>` header is sent

### API requests timing out
- Verify backend is running: `curl http://localhost:8080/api/v1/dummy`
- Check proxy in `frontend/vite.config.js`
- Look for CORS errors in browser console

## 📖 Documentation Files

- `frontend/README.md` - React frontend detailed docs
- `README_FRONTEND.md` - Original static frontend docs (deprecated)
- `pom.xml` - Backend dependencies
- `HELP.md` - Spring Boot help

## 🎯 Next Steps

1. **Frontend Development**: Customize components in `frontend/src/pages/`
2. **Backend Development**: Modify services in `src/main/java/com/gymTracker/`
3. **Database**: Configure in `application-dev.properties` and `application-prod.properties`
4. **Deployment**: Build and deploy to cloud (AWS, Azure, etc.)

## 💡 Pro Tips

- Use `npm run dev` with backend running to test full integration
- Keep browser DevTools open (F12) to inspect network requests
- Check `http://localhost:5173/__vite_ping` for Vite health
- Review logs in browser Console and backend terminal
- Use Postman to test APIs directly for debugging

## 📞 Support

For issues or questions:
1. Check `troubleshooting` section above
2. Review `frontend/README.md` for React-specific issues
3. Check Spring Boot logs for backend errors
4. Verify database connection and properties files

---

**Happy Tracking! 💪🏋️**

Enjoy using Gym Tracker to reach your fitness goals!
