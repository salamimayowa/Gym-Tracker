package com.gymTracker.GymTracker.Domain.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

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
   // private List<GymSessions> sessions;
}
