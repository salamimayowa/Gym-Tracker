package com.gymTracker.GymTracker.App.Dto.Request;

public class CheckinRequest {
    private String token;

    public CheckinRequest() {}

    public CheckinRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
