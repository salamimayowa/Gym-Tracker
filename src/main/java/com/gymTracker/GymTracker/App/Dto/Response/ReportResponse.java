package com.gymTracker.GymTracker.App.Dto.Response;

import com.gymTracker.GymTracker.Domain.Entity.Session;

import java.util.List;

public class ReportResponse {
    private String responseCode;
    private String responseMessage;

    private List<Session> sessions;

    public ReportResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public ReportResponse(String responseCode, String responseMessage, List<Session> sessions) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.sessions = sessions;
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
}
