package com.gymTracker.GymTracker.App.Dto.Request;

import com.gymTracker.GymTracker.Domain.Constants.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {
    private String userName;
    @Email(message = "Enter a valid mail address")
    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^[A-Za-z0-9]+@[A-Za-z]+\\.[A-Za-z]+$",
            message = "Email must valid"
    )
    private String email;
    @NotBlank(message = "Enter your password")
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$",
            message = "Must contain uppercase, number and special character"
    )
    private String password;

        private Roles role;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }
}
