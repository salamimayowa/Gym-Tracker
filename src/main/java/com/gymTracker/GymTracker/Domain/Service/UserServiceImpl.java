package com.gymTracker.GymTracker.Domain.Service;

import com.gymTracker.GymTracker.App.Dto.Request.*;
import com.gymTracker.GymTracker.App.Dto.Response.*;
import com.gymTracker.GymTracker.Domain.Constants.MailType;
import com.gymTracker.GymTracker.Domain.Constants.Roles;
import com.gymTracker.GymTracker.Domain.Entity.Session;
import com.gymTracker.GymTracker.Domain.Entity.User;
import com.gymTracker.GymTracker.Domain.Entity.Workout;
import com.gymTracker.GymTracker.Infracstructure.Config.Jwt.JwtUtils;
import com.gymTracker.GymTracker.Infracstructure.Repository.ReportRepository;
import com.gymTracker.GymTracker.Infracstructure.Repository.SessionRepository;
import com.gymTracker.GymTracker.Infracstructure.Repository.UserRepository;
import com.gymTracker.GymTracker.Infracstructure.Repository.WorkoutRepository;
import com.gymTracker.GymTracker.Infracstructure.Utils.SendMails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final SessionRepository sessionRepository;

    private final ReportRepository reportRepository;
    private final WorkoutRepository workoutRepository;
    private final JwtUtils jwtUtils;

    private final SendMails sendMails;

    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, SessionRepository sessionRepository,
                           ReportRepository reportRepository, WorkoutRepository workoutRepository, JwtUtils jwtUtils,
                           SendMails sendMails, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.reportRepository = reportRepository;
        this.workoutRepository = workoutRepository;
        this.jwtUtils = jwtUtils;
        this.sendMails = sendMails;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public RegistrationResponse registerUser(RegisterRequest registerRequest)
    {
        return createUser(registerRequest, Roles.USER, "Registration successful");
    }

    @Override
    public RegistrationResponse registerAdmin(RegisterRequest registerRequest) {
        return createUser(registerRequest, Roles.ADMIN, "Admin registration successful");
    }

    private Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private SessionResponse bookSessionFor(User user, LocalDateTime startTime) {
        Session session = new Session();
        LocalDateTime endTime = startTime.plusHours(1);
        LocalDateTime now = LocalDateTime.now();

        if (startTime.isBefore(now)) {
            return new SessionResponse("01", "Cannot book a session in the past.");
        }
        if (startTime.isBefore(now.plusHours(24))) {
            return new SessionResponse("02", "Session must be booked at least 24 hours earlier");
        }
        if (sessionRepository.findAllByStartTime(startTime).size() > 49) {
            return new SessionResponse("03", "maximum capacity filled");
        }

        Optional<Session> lastBookedSession = sessionRepository.findTopByUserIdOrderByStartTimeDesc(user.getId().toString());
        if (lastBookedSession.isPresent()) {
            Session lastSession = lastBookedSession.get();
            int lastHour = lastSession.getStartTime().getHour();
            int requestedHour = startTime.getHour();
            if (lastHour - 1 == requestedHour && startTime.toLocalDate().equals(lastSession.getStartTime().toLocalDate())) {
                return new SessionResponse("07", "Cannot book a session before your last booked session on the same day.");
            }
            if (requestedHour - 1 == lastHour && startTime.toLocalDate().equals(lastSession.getStartTime().toLocalDate())) {
                return new SessionResponse("05", "Concurrent Sessions cannot be booked.");
            }
        }

        int sessionsBookedToday = sessionRepository.countByUserIdAndStartTimeBetween(
                user.getId().toString(),
                startTime.toLocalDate().atStartOfDay(),
                startTime.toLocalDate().atTime(23, 59, 59)
        );

        if (sessionsBookedToday >= 2) {
            return new SessionResponse("06", "Maximum of 2 sessions per day exceeded.");
        }

        session.setUserId(String.valueOf(user.getId()));
        session.setStartTime(startTime);
        session.setEndTime(endTime);
        session.setActive(true);
        sessionRepository.save(session);

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("sessionDate", startTime.toLocalDate().toString());
        variables.put("sessionTime", startTime.toLocalTime().toString());
        variables.put("gymLocation", "Union Fitness Center");
        sendMails.sendEmail(MailType.SESSION_BOOKING, user.getEmail(), variables);

        return new SessionResponse("00", "Booking Successful");
    }

    private DeleteResponse deleteSessionById(User user, String sessionId) {
        Optional<Session> optionalSession = sessionRepository.findById(UUID.fromString(sessionId));
        if (optionalSession.isEmpty()) {
            return new DeleteResponse("02", "No session found for user");
        }

        Session session = optionalSession.get();
        sessionRepository.delete(session);

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("gymLocation", "Union Fitness Center");
        sendMails.sendEmail(MailType.SESSION_DELETION, user.getEmail(), variables);
        return new DeleteResponse("00", "Session Deleted Successfully");
    }

    private DeleteResponse deleteWorkoutById(User user, String workoutId) {
        Optional<Workout> optionalWorkout = workoutRepository.findById(UUID.fromString(workoutId));
        if (optionalWorkout.isEmpty()) {
            return new DeleteResponse("02", "No workout found for user");
        }

        Workout workout = optionalWorkout.get();
        workoutRepository.delete(workout);
        return new DeleteResponse("00", "Workout Deleted Successfully");
    }

    private RegistrationResponse createUser(RegisterRequest registerRequest, Roles role, String successMessage) {
        log.info("Registration started for user {} with role {}", registerRequest.getEmail(), role);
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new RegistrationResponse("01", "User Already exists");
        }

        User user = new User();
        user.setUserName(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setRole(role);
        user.setDob(registerRequest.getDob());
        user.setGender(registerRequest.getGender());

        userRepository.save(user);

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("gymLocation", "Union Fitness Center");
        sendMails.sendEmail(MailType.SESSION_REGISTRATION, registerRequest.getEmail(), variables);
        return new RegistrationResponse("00", successMessage);
    }



    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) {
        Optional<User> user = findUserByEmail(loginRequest.getEmail());
        if (user.isEmpty()) {
            return new LoginResponse("01", "User does not exist");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            return new LoginResponse("02", "Bad credentials/ Invalid password");
        }
        if (loginRequest.getRole() == null) {
            return new LoginResponse("03", "Role is required");
        }
        if (user.get().getRole() == null || !user.get().getRole().equals(loginRequest.getRole())) {
            return new LoginResponse("04", "Selected role does not match this account");
        }
        String token = jwtUtils.generateTokenFromEmail(user.get().getEmail());
        return new LoginResponse("00", "Login Successful", token, user.get().getRole());
    }

    @Override
    public SessionResponse bookSession(SessionRequest sessionRequest) {
        log.info("Attempting to book session at {}", sessionRequest.getStartTime());
        LocalDateTime startTime = sessionRequest.getStartTime();
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> optionalUser = findUserByEmail(email);
        log.info("User {}  is attempting to book session at {}", email, startTime);

        if (optionalUser.isEmpty()) {
            return new SessionResponse("04", "User not found");
        }
        User user = optionalUser.get();
        return bookSessionFor(user, startTime);
    }

    @Override
    public SessionResponse bookSessionForUser(AdminBookSessionRequest adminBookSessionRequest) {
        Optional<User> optionalUser = findUserByEmail(adminBookSessionRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return new SessionResponse("04", "User not found");
        }
        return bookSessionFor(optionalUser.get(), adminBookSessionRequest.getStartTime());
    }

    @Override
    public ViewResponse viewSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> optionalUser = findUserByEmail(email);

        if (optionalUser.isEmpty()) {
            return new ViewResponse("01", "User not found");
        }

        User user = optionalUser.get();
        Optional<List<Session>> sessionList  = sessionRepository.findByUserId(String.valueOf(user.getId()));

        if (sessionList.isEmpty()) {
            return new ViewResponse("01", "No sessions found for this user");
        }

        return new ViewResponse("00", "Successful", sessionList.get());
    }

    @Override
    public ViewResponse viewSessionByEmail(AdminUserRequest adminUserRequest) {
        Optional<User> optionalUser = findUserByEmail(adminUserRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return new ViewResponse("01", "User not found");
        }
        Optional<List<Session>> sessionList = sessionRepository.findByUserId(String.valueOf(optionalUser.get().getId()));
        return sessionList.map(sessions -> new ViewResponse("00", "Successful", sessions))
                .orElseGet(() -> new ViewResponse("01", "No sessions found for this user"));
    }


    @Override
    public EditResponse editSession(EditRequest editRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return new EditResponse("01", "User not found");
        }

        User user = optionalUser.get();

        Optional<Session> optionalSession = sessionRepository.findById(UUID.fromString(editRequest.getSessionId()));

        if (optionalSession.isEmpty()) {
            return new EditResponse("02", "No session found for user");
        }

        Session session = optionalSession.get();

        LocalDateTime newTime = editRequest.getNewTime();
        LocalDateTime endTime = editRequest.getNewTime().plusHours(1);
        LocalDateTime now = LocalDateTime.now();

        if (newTime.isBefore(now)) {
            return new EditResponse("01", "Cannot book a session in the past.");
        }
        if (newTime.isBefore(now.plusHours(24))) {
            return new EditResponse("02", "Session must be booked at least 24 hours earlier");
        }
        if (sessionRepository.findAllByStartTime(editRequest.getNewTime()).size() > 49){
            return new EditResponse("03" , "maximum capacity filled");
        }
        session.setStartTime(newTime);
        session.setEndTime(endTime);
        session.setActive(true);

        sessionRepository.save(session);
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("sessionDate", newTime.toLocalDate().toString());
        variables.put("sessionTime", endTime.toLocalTime().toString());
        variables.put("gymLocation", "Union Fitness Center");
        sendMails.sendEmail(MailType.SESSION_EDITED, user.getEmail(), variables);
        return new EditResponse("00" , "Session Updated successfully");
    }

    @Override
    public DeleteResponse deleteSession(DeleteRequest deleteRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("");
        Optional<User> optionalUser = findUserByEmail(email);

        if (optionalUser.isEmpty()) {
            return new DeleteResponse("01", "User not found");
        }

        return deleteSessionById(optionalUser.get(), deleteRequest.getSessionId());
    }

    @Override
    public DeleteResponse deleteSessionForUser(AdminDeleteRequest adminDeleteRequest) {
        Optional<User> optionalUser = findUserByEmail(adminDeleteRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return new DeleteResponse("01", "User not found");
        }
        return deleteSessionById(optionalUser.get(), adminDeleteRequest.getResourceId());
    }

    @Override
    public ReportResponse findAllSessions(ReportRequest reportRequest) {
        LocalDateTime requestTime = reportRequest.getTime() != null
                ? reportRequest.getTime()
                : LocalDateTime.now();


        int hour = requestTime.getHour();


        LocalDateTime fromTime = LocalDate.now().atTime(hour, 0);

        List<Session> sessions = sessionRepository.findAllByStartTimeGreaterThanEqual(fromTime);

        if (sessions.isEmpty()) {
            return new ReportResponse("01", "No sessions found");
        }

        return new ReportResponse("00", "Sessions Generated Successfully", sessions);
    }

    @Override
    public AvailableResponse findAllSessionsByDate(AvailableRequest availableRequest) {
        LocalDate date = availableRequest.getDate();

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Session> sessions = sessionRepository.findAllByStartTimeBetween(startOfDay, endOfDay);


        List<HourAvailability> availabilityList = new ArrayList<>();

        for (int hour = 0; hour < 24; hour++) {
            final int currentHour = hour;

            long sessionCount = sessions.stream()
                    .filter(session -> session.getStartTime().getHour() == currentHour)
                    .count();

            boolean available = sessionCount < 50;

            availabilityList.add(new HourAvailability(currentHour, available));
        }

        return new AvailableResponse("00", "Sessions Generated Successfully", availabilityList);
    }

    @Override
    public AdminUserDataResponse findUserData(AdminUserRequest adminUserRequest) {
        Optional<User> optionalUser = findUserByEmail(adminUserRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return new AdminUserDataResponse("01", "User not found");
        }

        User user = optionalUser.get();
        List<Session> sessions = sessionRepository.findByUserId(String.valueOf(user.getId())).orElseGet(ArrayList::new);
        List<Workout> workouts = workoutRepository.findByUserId(String.valueOf(user.getId())).orElseGet(ArrayList::new);
        return new AdminUserDataResponse("00", "Successful", sessions, workouts);
    }

    @Override
    public WorkoutListResponse viewWorkouts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> optionalUser = findUserByEmail(email);
        if (optionalUser.isEmpty()) {
            return new WorkoutListResponse("01", "User not found");
        }
        List<Workout> workouts = workoutRepository.findByUserId(String.valueOf(optionalUser.get().getId())).orElseGet(ArrayList::new);
        return workouts.isEmpty()
                ? new WorkoutListResponse("01", "No workouts found")
                : new WorkoutListResponse("00", "Successful", workouts);
    }

    @Override
    public WorkoutListResponse viewWorkoutsByEmail(AdminUserRequest adminUserRequest) {
        Optional<User> optionalUser = findUserByEmail(adminUserRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return new WorkoutListResponse("01", "User not found");
        }
        List<Workout> workouts = workoutRepository.findByUserId(String.valueOf(optionalUser.get().getId())).orElseGet(ArrayList::new);
        return workouts.isEmpty()
                ? new WorkoutListResponse("01", "No workouts found")
                : new WorkoutListResponse("00", "Successful", workouts);
    }

    @Override
    public DeleteResponse deleteWorkoutForUser(AdminDeleteRequest adminDeleteRequest) {
        Optional<User> optionalUser = findUserByEmail(adminDeleteRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return new DeleteResponse("01", "User not found");
        }
        return deleteWorkoutById(optionalUser.get(), adminDeleteRequest.getResourceId());
    }


    public UtilizeResponse utilizeSession() {
        String email  = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Utilizing session for user: {}", email);
        return userRepository.findByEmail(email)
                .map(user -> {
                    String userId = String.valueOf(user.getId());
                    LocalDateTime now = LocalDateTime.now();
                    LocalDateTime startOfHour = now.withMinute(0).withSecond(0).withNano(0);
                    LocalDateTime endOfHour = now.withMinute(59).withSecond(59).withNano(999999999);


                    Optional<Session> sessionOpt = sessionRepository
                            .findTopByUserIdAndStartTimeBetweenAndActiveIsTrue(userId, startOfHour, endOfHour);

                    if (sessionOpt.isPresent()) {
                        Session session = sessionOpt.get();
                        if (!session.isUtilize()) {
                            session.setUtilize(true);
                            sessionRepository.save(session);
                            log.info("Session utilized for user: {}", email);
                            return new UtilizeResponse("00", "Session utilized successfully.");
                        } else {
                            log.warn("Session already utilized for user: {}", email);
                            return new UtilizeResponse("01", "Session already utilized.");
                        }
                    } else {
                        log.warn("No active session found for user: {}", email);
                        return new UtilizeResponse("02", "No active session found at this time.");
                    }

                })
                .orElseGet(() -> {
                    log.warn("User not found for email: {}", email);
                    return new UtilizeResponse("03", "User not found.");
                });
    }

    @Override
    public WorkoutResponse createWorkout(WorkoutRequest workoutRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("");
        Optional<User> optionalUser = findUserByEmail(email);

        if (optionalUser.isEmpty()) {
            return new WorkoutResponse("01", "User not found");
        }
        User user = optionalUser.get();
        log.info("Attempting to create a workout");
        Workout workout = new Workout();
        workout.setUserId(String.valueOf(user.getId()));
        workout.setExerciseName(workoutRequest.getExerciseName());
        workout.setTargetReps(workoutRequest.getTargetReps());
        workout.setSets(workoutRequest.getSets());
        workout.setWorkoutDate(workoutRequest.getWorkoutDate());
        log.info("Attempting to save to the repository");
        workoutRepository.save(workout);
        log.info("Attempt successfully");
        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getFullName());
        variables.put("gymLocation", "Union Fitness Center");
        sendMails.sendEmail(MailType.WORKOUT ,user.getEmail() , variables);
        return new WorkoutResponse("00" , "Workout created Successfully");
    }


}

