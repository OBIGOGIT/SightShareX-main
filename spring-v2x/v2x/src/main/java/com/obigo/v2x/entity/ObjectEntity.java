package com.obigo.v2x.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name ="object_m")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "objectSummaryEntity")
public class ObjectEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long seq;

    @OneToOne(targetEntity= ObjectImageEntity.class, fetch=FetchType.EAGER)
    @JoinColumn(name="seq")
    private ObjectImageEntity objectImageEntity;


    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "summary_id")  // foreign key 설정
    private ObjectSummaryEntity objectSummaryEntity;

    @Column
    private Double lat;

    @Column
    private Double lng;

    @Column
    private String objectName;

    @Transient
    private boolean check;

}
