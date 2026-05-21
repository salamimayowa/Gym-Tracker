Frontend integration and usage

- Files added: `src/main/resources/static/app/index.html`, `app.js`, `styles.css` and `src/main/resources/static/index.html` (redirect).
- How to access: Run the Spring Boot backend (e.g. `mvn spring-boot:run`), then open http://localhost:8080/ in your browser.
- Functionality:
  - Register: POST `/api/v1/register` with fields `fullName, username, email, password, gender, dob`.
  - Login: POST `/api/v1/login` with `email, password`. JWT token returned is stored in `localStorage.token`.
  - Book Session: POST `/api/v1/bookSession` with `startTime` formatted `yyyy-MM-dd'T'HH:mm:ss` (the app converts `datetime-local` to include seconds).
  - View Sessions: GET `/api/v1/view` (requires logged-in user token).
  - Create Workout: POST `/api/v1/workout` with `exerciseName, targetReps, sets, workoutDate`.
- Notes:
  - The SPA sends the JWT as `Authorization: Bearer <token>` automatically after login.
  - If you want the SPA on a separate server, set `API_BASE` in `app.js` to the backend URL (e.g. `http://localhost:8080/api/v1`) and enable CORS appropriately.
