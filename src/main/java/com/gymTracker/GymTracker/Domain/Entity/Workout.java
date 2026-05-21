package com.gymTracker.GymTracker.Domain.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@ToString
@Table(name = "GYM_WORKOUT")
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String userId;
    private String exerciseName;
    private int targetReps;
    private int sets;
    private LocalDate workoutDate;


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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


    @Override
    public String toString() {
        return "Workout{" +
                "id=" + id +
            ", userId='" + userId + '\'' +
                ", exerciseName='" + exerciseName + '\'' +
                ", targetReps=" + targetReps +
                ", sets=" + sets +
                ", workoutDate=" + workoutDate +
                '}';
    }
}
