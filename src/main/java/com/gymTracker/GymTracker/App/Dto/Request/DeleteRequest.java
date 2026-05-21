package com.gymTracker.GymTracker.App.Dto.Request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class DeleteRequest {
    @NotNull(message = "New time is required")
    @Pattern(
            regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
            message = "Session ID must be a valid UUID"
    )
    private  String sessionId;

    public DeleteRequest() {
    }

    public DeleteRequest(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
