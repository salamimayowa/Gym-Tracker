package com.gymTracker.GymTracker.App.Dto.Response;

import com.gymTracker.GymTracker.Domain.Entity.Session;
import com.gymTracker.GymTracker.Domain.Entity.Workout;

import java.util.List;

public class AdminUserDataResponse {
    private String responseCode;
    private String responseMessage;
    private List<Session> sessions;
    private List<Workout> workouts;

    public AdminUserDataResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public AdminUserDataResponse(String responseCode, String responseMessage, List<Session> sessions, List<Workout> workouts) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.sessions = sessions;
        this.workouts = workouts;
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

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public List<Workout> getWorkouts() {
        return workouts;
    }

    public void setWorkouts(List<Workout> workouts) {
        this.workouts = workouts;
    }
}
