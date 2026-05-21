package com.gymTracker.GymTracker.App.Dto.Request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class WorkoutRequest {

    @NotBlank(message = "Exercise name cannot be blank")
    @Size(min = 2, message = "Exercise name must be at least 2 characters long")
    private String exerciseName;

    @Positive(message = "Target reps must be greater than 0")
    private int targetReps;

    @Positive(message = "Sets must be greater than 0")
    private int sets;

    @NotNull(message = "Workout date is required")
    @FutureOrPresent(message = "Workout date cannot be in the past")
    private LocalDate workoutDate;


    public WorkoutRequest() {
    }

    public WorkoutRequest(String exerciseName, int targetReps, int sets, LocalDate workoutDate) {
        this.exerciseName = exerciseName;
        this.targetReps = targetReps;
        this.sets = sets;
        this.workoutDate = workoutDate;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public int getTargetReps() {
        return targetReps;
    }

    public void setTargetReps(int targetReps) {
        this.targetReps = targetReps;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public LocalDate getWorkoutDate() {
        return workoutDate;
    }

    public void setWorkoutDate(LocalDate workoutDate) {
        this.workoutDate = workoutDate;
    }

}
