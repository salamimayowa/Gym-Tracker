package com.gymTracker.GymTracker.Infracstructure.Repository;

import com.gymTracker.GymTracker.Domain.Entity.ReportUsage;
import com.gymTracker.GymTracker.Domain.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<ReportUsage , UUID> {

//   List<Session> findAllSessions(LocalDateTime time);
}
