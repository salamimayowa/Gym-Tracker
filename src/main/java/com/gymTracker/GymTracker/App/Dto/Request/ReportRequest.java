package com.gymTracker.GymTracker.App.Dto.Request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class ReportRequest {
    @NotNull(message = "Time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime time;
    @Min(value = 0, message = "Hour must be at least 0")
    @Max(value = 23, message = "Hour must be no more than 23")
    private int hour;

    public ReportRequest() {
    }

    public ReportRequest(LocalDateTime time, int hour) {
        this.time = time;
        this.hour = hour;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }
}
