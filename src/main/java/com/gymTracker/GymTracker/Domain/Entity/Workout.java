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
    private String exerciseName;
    private int targetReps;
    private int sets;
    private LocalDate workoutDate;
    private LocalDateTime createdAt;

}
