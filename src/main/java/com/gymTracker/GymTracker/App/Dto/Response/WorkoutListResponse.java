package com.gymTracker.GymTracker.App.Dto.Response;

import com.gymTracker.GymTracker.Domain.Entity.Workout;

import java.util.List;

public class WorkoutListResponse {
    private String responseCode;
    private String responseMessage;
    private List<Workout> workouts;

    public WorkoutListResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public WorkoutListResponse(String responseCode, String responseMessage, List<Workout> workouts) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
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

    public List<Workout> getWorkouts() {
        return workouts;
    }

    public void setWorkouts(List<Workout> workouts) {
        this.workouts = workouts;
    }
}
