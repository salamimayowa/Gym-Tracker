package com.gymTracker.GymTracker.Infracstructure.Repository;

import com.gymTracker.GymTracker.Domain.Entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository

public interface WorkoutRepository extends JpaRepository<Workout , UUID> {

    Optional<List<Workout>> findAllByWorkoutDate(LocalDate workoutDate);

    Optional<List<Workout>> findByUserId(String userId);
}
