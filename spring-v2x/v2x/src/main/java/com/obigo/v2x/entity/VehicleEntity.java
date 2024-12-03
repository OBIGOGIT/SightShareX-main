package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.*;

import javax.persistence.*;


@Entity
@Table(name ="vehicle_m ")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="vehicle_seq")
    private Long vehicleSeq;

    @Column(unique=true)
    private String vin;

    @Column
    private Double lat;

    @Column
    private Double lng;

    @Column
    private boolean connection;
}