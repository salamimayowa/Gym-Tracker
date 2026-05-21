package com.gymTracker.GymTracker.Infracstructure.Task;

import com.gymTracker.GymTracker.Domain.Entity.Session;
import com.gymTracker.GymTracker.Infracstructure.Repository.SessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
@Component
@Slf4j
public class SessionScheduler {
    @Autowired
    private SessionRepository sessionRepository;

     @Scheduled(cron = "0 0 * * * *")

    public List<Session> activateUpcomingSessions() {
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime nextHour = currentTime.plusHours(1);

        log.info("Scheduled task running at {}. Activating sessions starting between {} and {}",
                currentTime, currentTime, nextHour);

        // Find sessions that start within the next hour
        List<Session> upcomingSessions = sessionRepository.findAllByStartTimeBetween(currentTime, nextHour);

        log.info("Found {} sessions to activate", upcomingSessions.size());

        // Avoid unnecessary processing if no sessions found
        if (upcomingSessions.isEmpty()) {
            return upcomingSessions;
        }

        // Set sessions to active
        upcomingSessions.forEach(session -> {
            log.info("Activating session ID [{}] for user [{}]", session.getId(), session.getUserId());
            session.setActive(true);
        });

        // Save all updated sessions
        sessionRepository.saveAll(upcomingSessions);

        return upcomingSessions;
    }

}
