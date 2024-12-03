package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Table(name ="obu_m")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObuEntity extends BaseTimeEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long seq;

    @Column
    private String oubId;

    @Column
    private Double rtt;

    @Column
    private Double mbps;

    @Column
    private Double packetSize;

    @Column
    private Double packetRate;
}