package com.gymTracker.GymTracker.App.Dto.Response;

import lombok.AllArgsConstructor;



public class RegistrationResponse {
    private String responseCode;
    private String responseMessage;

    public RegistrationResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
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
