package com.gymTracker.GymTracker.App.Dto.Request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class HourAvailability {
    @Min(value = 0, message = "Hour must be at least 0")
    @Max(value = 23, message = "Hour must be no more than 23")
    private int hour;
    @NotNull(message = "Availability must be specified")
    private boolean available;

    public HourAvailability() {
    }

    public HourAvailability(int hour, boolean available) {
        this.hour = hour;
        this.available = available;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
