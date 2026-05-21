package com.gymTracker.GymTracker.App.Dto.Response;

import com.gymTracker.GymTracker.App.Dto.Request.HourAvailability;
import com.gymTracker.GymTracker.Domain.Entity.Session;

import java.util.List;

public class AvailableResponse {
    private String responseCode;
    private String responseMessage;

    private List<HourAvailability> availabilityList;
    public AvailableResponse(String responseCode, String responseMessage) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public AvailableResponse(String responseCode, String responseMessage, List<HourAvailability> availabilityList) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.availabilityList = availabilityList;
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

    public List<HourAvailability> getAvailabilityList() {
        return availabilityList;
    }

    public void setAvailabilityList(List<HourAvailability> availabilityList) {
        this.availabilityList = availabilityList;
    }
}
