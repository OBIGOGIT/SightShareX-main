package com.obigo.v2x.api.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="log_dangerous_obstacle_h")
public class LogDangerousObstacleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="log_dangerous_obstacle_h")
    private long logDangerousObstacleSeq;


    @Column(name="emergency_type")
    private String emergencyType;


    @Column(name="latitude")
    private Double latitude;


    @Column(name="longitude")
    private Double longitude;


    @Column(name="car_type")
    private String carType;


    @Column(name="created")
    private LocalDateTime created;


}
