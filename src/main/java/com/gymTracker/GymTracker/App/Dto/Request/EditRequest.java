package com.gymTracker.GymTracker.App.Dto.Request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public class EditRequest {
    @NotNull(message = "New time is required")
    @Pattern(
            regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
            message = "Session ID must be a valid UUID"
    )
    private String sessionId;
    @NotNull(message = "New time is required")
    @Future(message = "New time must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime newTime;

    public EditRequest() {
    }

    public EditRequest(String sessionId, LocalDateTime newTime) {
        this.sessionId = sessionId;
        this.newTime = newTime;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getNewTime() {
        return newTime;
    }

    public void setNewTime(LocalDateTime newTime) {
        this.newTime = newTime;
    }
}
