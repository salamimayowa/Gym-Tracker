package com.gymTracker.GymTracker.App.Dto.Request;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Provide your fullname with Lastname first ")
    private String fullName;
    @NotBlank(message = "Choose your username")
    private String username;
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
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    @NotBlank(message = "Select your gender")
    private String gender;
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date of Birth must be in yyyy-MM-dd format")
    @NotBlank(message = "Enter your Date of Birth")
    private  String dob;

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
}
