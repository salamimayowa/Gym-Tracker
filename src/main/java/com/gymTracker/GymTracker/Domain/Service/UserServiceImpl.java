package com.gymTracker.GymTracker.Domain.Service;

import com.gymTracker.GymTracker.App.Dto.Request.RegisterRequest;
import com.gymTracker.GymTracker.App.Dto.Response.RegistrationResponse;
import com.gymTracker.GymTracker.Domain.Entity.User;
import com.gymTracker.GymTracker.Infracstructure.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public RegistrationResponse registerUser(RegisterRequest registerRequest)
    {
        User user = new User();
        user.setUserName(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setDob(registerRequest.getDob());
        user.setGender(registerRequest.getGender());

        userRepository.save(user);
        return new RegistrationResponse("00","Registration successful");
    }
}
