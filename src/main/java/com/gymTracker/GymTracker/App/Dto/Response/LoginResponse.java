package com.gymTracker.GymTracker.App.Dto.Response;

import com.gymTracker.GymTracker.Domain.Constants.Roles;

public class LoginResponse {
    private String responseCode;
    private String responseMessage;

    private String token;

    private Roles role;

    public LoginResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public LoginResponse(String responseCode, String responseMessage, String token) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.token = token;
    }

    public LoginResponse(String responseCode, String responseMessage, String token, Roles role) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.token = token;
        this.role = role;
    }

    public LoginResponse() {

    }

    public String getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(String responseCode) {
        this.responseCode = responseCode;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }
}
