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
@Table(name="log_shar_info_h")
public class LogSharInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="log_shar_info_seq")
    private long logSharInfoSeq;


    @Column(name="latitude")
    private Double latitude;


    @Column(name="longitude")
    private Double longitude;


    @Column(name="heading")
    private Double heading;


    @Column(name="velocity")
    private Double velocity;


    @Column(name="type")
    private String type;


    @Column(name="car_type")
    private String carType;


    @Column(name="created")
    private LocalDateTime created;


}
