package com.gymTracker.GymTracker.App.Controller;

import com.google.zxing.WriterException;
import com.gymTracker.GymTracker.App.Dto.Request.*;
import com.gymTracker.GymTracker.App.Dto.Response.*;
import com.gymTracker.GymTracker.Domain.Service.UserService;
import com.gymTracker.GymTracker.Infracstructure.Utils.QRCodeGenerator;
import com.gymTracker.GymTracker.Infracstructure.Config.Jwt.JwtUtils;
import com.gymTracker.GymTracker.App.Dto.Request.CheckinRequest;
import jakarta.validation.Path;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import lombok.extern.slf4j.XSlf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@EnableMethodSecurity
@Slf4j
public class AppController {

    private final UserService userService;
    private final JwtUtils jwtUtils;


    public AppController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public RegistrationResponse register(@RequestBody @Valid RegisterRequest registerRequest){
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/admin/register")
    @PreAuthorize("hasAuthority('ADMIN')")
    public RegistrationResponse registerAdmin(@RequestBody @Valid RegisterRequest registerRequest){
        return userService.registerAdmin(registerRequest);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest loginRequest){
        return userService.loginUser(loginRequest);
    }

    @GetMapping("/dummy")
    public String dummyEndPoint(){
        return "yay, welcome!";
    }

    @PostMapping("/bookSession")
    @PreAuthorize("hasAuthority('USER')")
    public SessionResponse bookSession(@RequestBody @Valid SessionRequest sessionRequest){
        System.out.println("attempting to book session");
        //System.out.println("User details ::: " + authenticationPrincipal.getAuthentication().getAuthorities().toString());
        return userService.bookSession(sessionRequest);
    }

    @PostMapping("/admin/bookSession")
    @PreAuthorize("hasAuthority('ADMIN')")
    public SessionResponse bookSessionForUser(@RequestBody @Valid AdminBookSessionRequest adminBookSessionRequest){
        return userService.bookSessionForUser(adminBookSessionRequest);
    }

    @GetMapping("/view")
    @PreAuthorize("hasAuthority('USER')")
    public ViewResponse viewSession(){
        return userService.viewSession();
    }

    @PostMapping("/admin/view")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ViewResponse viewSessionByEmail(@RequestBody @Valid AdminUserRequest adminUserRequest){
        return userService.viewSessionByEmail(adminUserRequest);
    }

    @PutMapping("/edit")
    @PreAuthorize("hasAuthority('USER')")
    public EditResponse editSession(@RequestBody @Valid EditRequest editRequest){
        return userService.editSession(editRequest);
    }
    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('USER')")
    public DeleteResponse deleteSession(@RequestBody @Valid DeleteRequest deleteRequest){
        return userService.deleteSession(deleteRequest);
    }

    @DeleteMapping("/admin/session")
    @PreAuthorize("hasAuthority('ADMIN')")
    public DeleteResponse deleteSessionForUser(@RequestBody @Valid AdminDeleteRequest adminDeleteRequest){
        return userService.deleteSessionForUser(adminDeleteRequest);
    }

    @PostMapping("/report")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ReportResponse reportUsage(@RequestBody @Valid ReportRequest reportRequest){
        return userService.findAllSessions(reportRequest);
    }

    @PostMapping("/admin/user-data")
    @PreAuthorize("hasAuthority('ADMIN')")
    public AdminUserDataResponse findUserData(@RequestBody @Valid AdminUserRequest adminUserRequest){
        return userService.findUserData(adminUserRequest);
    }

    @DeleteMapping("/admin/workout")
    @PreAuthorize("hasAuthority('ADMIN')")
    public DeleteResponse deleteWorkoutForUser(@RequestBody @Valid AdminDeleteRequest adminDeleteRequest){
        return userService.deleteWorkoutForUser(adminDeleteRequest);
    }

    @PostMapping("available")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public AvailableResponse availableSession(@RequestBody @Valid AvailableRequest availableRequest){
        return userService.findAllSessionsByDate(availableRequest);
    }
    @GetMapping("/generate-qr")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<QrResponse> generateQrCode(@RequestParam(name = "sessionId") String sessionId) {
        // Generate a short-lived check-in token and embed the frontend check-in URL in the QR code.
        try {
            String token = jwtUtils.generateCheckinToken(sessionId, 300); // 5 minutes
            String frontEndBase = "http://localhost:5175";
            String checkinUrl = frontEndBase + "/checkin?token=" + token;

            String qrCodeBase64 = QRCodeGenerator.generateQRCodeBase64(checkinUrl, 300, 300);
            log.info("QR code generated successfully for session {}", sessionId);

            QrResponse response = new QrResponse("00", qrCodeBase64);
            return ResponseEntity.ok(response);

        } catch (WriterException | IOException e) {
            log.error("Failed to generate QR code: {}", e.getMessage());

            QrResponse errorResponse = new QrResponse("99", "Failed to generate QR code.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/checkin")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<UtilizeResponse> checkin(@RequestBody CheckinRequest checkinRequest) {
        UtilizeResponse response = userService.utilizeSessionWithToken(checkinRequest.getToken());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/utilize")
    //@PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<UtilizeResponse> utilizeSession() {
        UtilizeResponse response = userService.utilizeSession();
        return ResponseEntity.ok(response);
    }

    @PostMapping("workout")
    @PreAuthorize("hasAuthority('USER')")
    public WorkoutResponse createWorkout(@RequestBody @Valid WorkoutRequest workoutRequest){
        return userService.createWorkout(workoutRequest);
    }

    @GetMapping("/workouts")
    @PreAuthorize("hasAuthority('USER')")
    public WorkoutListResponse viewWorkouts(){
        return userService.viewWorkouts();
    }


}
