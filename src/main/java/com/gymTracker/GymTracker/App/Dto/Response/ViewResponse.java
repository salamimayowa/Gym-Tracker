package com.gymTracker.GymTracker.App.Dto.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gymTracker.GymTracker.Domain.Entity.Session;

import java.util.List;
import java.util.Optional;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ViewResponse {
    private String responseCode;
    private String responseMessage;

    public ViewResponse(String number, String successful, Optional<Session> sessionList) {
    }

    public List<Session> getBookedSessions() {
        return bookedSessions;
    }

    public void setBookedSessions(List<Session> availableSessions) {
        this.bookedSessions = availableSessions;
    }

    List<Session> bookedSessions;

    public ViewResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public ViewResponse(String responseCode, String responseMessage, List<Session> bookedSession) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.bookedSessions = bookedSession;
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

}
