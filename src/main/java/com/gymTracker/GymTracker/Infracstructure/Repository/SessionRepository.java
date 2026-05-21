package com.gymTracker.GymTracker.Infracstructure.Repository;

import com.gymTracker.GymTracker.Domain.Entity.Session;

import com.gymTracker.GymTracker.Domain.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findAllByStartTime(LocalDateTime startTime);

    Optional<List<Session>> findByUserId(String userId);
    Optional<Session> findById(UUID sessionId);

    List<Session> findAllByStartTimeGreaterThanEqual(LocalDateTime startTime);
    List<Session> findAllByStartTimeBetween(LocalDateTime startTime , LocalDateTime endTime);

    Optional<Session> findTopByUserIdOrderByStartTimeDesc(String userId);

    int countByUserIdAndStartTimeBetween(String userId, LocalDateTime start, LocalDateTime end);
    Optional<Session> findTopByUserIdAndStartTimeBetweenAndActiveIsTrue(String userId, LocalDateTime startOfHour, LocalDateTime endOfHour);
}
