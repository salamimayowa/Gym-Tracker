package com.gymTracker.GymTracker.Domain.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@ToString
@Table(name = "GYM_REPORTUSAGE")
public class ReportUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToMany
    @JoinTable(
            name = "report_sessions",
            joinColumns = @JoinColumn(name = "report_id"),
            inverseJoinColumns = @JoinColumn(name = "session_id")
    )
    private List<Session> sessions;
    private LocalDateTime time;

    public ReportUsage(UUID id, List<Session> sessions) {
        this.id = id;
        this.sessions = sessions;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }
}
