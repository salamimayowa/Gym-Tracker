package com.gymTracker.GymTracker.Domain.Service;


import com.gymTracker.GymTracker.App.Dto.Request.RegisterRequest;
import com.gymTracker.GymTracker.App.Dto.Response.RegistrationResponse;


public interface UserService {
    RegistrationResponse registerUser(RegisterRequest registerRequest);

}
