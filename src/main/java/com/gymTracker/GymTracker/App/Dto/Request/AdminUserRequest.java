package com.gymTracker.GymTracker.App.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AdminUserRequest {
    @Email(message = "Enter a valid mail address")
    @NotBlank(message = "Email is required")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
