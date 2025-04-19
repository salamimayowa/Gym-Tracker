package com.gymTracker.GymTracker.App.Controller;

import com.gymTracker.GymTracker.App.Dto.Request.RegisterRequest;
import com.gymTracker.GymTracker.App.Dto.Response.RegistrationResponse;
import com.gymTracker.GymTracker.Domain.Service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")

public class AppController {

    private final UserService userService;

    public AppController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")

    public RegistrationResponse register(@RequestBody RegisterRequest registerRequest){
        return userService.registerUser(registerRequest);
    }
}
