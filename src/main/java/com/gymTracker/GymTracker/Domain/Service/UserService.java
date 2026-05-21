package com.gymTracker.GymTracker.Domain.Service;


import com.gymTracker.GymTracker.App.Dto.Request.*;
import com.gymTracker.GymTracker.App.Dto.Response.*;

import java.util.UUID;


public interface UserService {
    RegistrationResponse registerUser(RegisterRequest registerRequest);

    RegistrationResponse registerAdmin(RegisterRequest registerRequest);

    LoginResponse loginUser(LoginRequest loginRequest);

    SessionResponse bookSession(SessionRequest sessionRequest);

    SessionResponse bookSessionForUser(AdminBookSessionRequest adminBookSessionRequest);

    ViewResponse viewSession ();
    ViewResponse viewSessionByEmail(AdminUserRequest adminUserRequest);
    EditResponse editSession(EditRequest editRequest);

    DeleteResponse deleteSession(DeleteRequest deleteRequest);

    DeleteResponse deleteSessionForUser(AdminDeleteRequest adminDeleteRequest);

    ReportResponse findAllSessions (ReportRequest reportRequest);

    AvailableResponse findAllSessionsByDate(AvailableRequest availableRequest);

    AdminUserDataResponse findUserData(AdminUserRequest adminUserRequest);

    WorkoutListResponse viewWorkouts();

    WorkoutListResponse viewWorkoutsByEmail(AdminUserRequest adminUserRequest);

    DeleteResponse deleteWorkoutForUser(AdminDeleteRequest adminDeleteRequest);

    UtilizeResponse utilizeSession();

    WorkoutResponse createWorkout (WorkoutRequest workoutRequest);

    //UtilizeResponse utilizeSession(UUID sessionId);
}
