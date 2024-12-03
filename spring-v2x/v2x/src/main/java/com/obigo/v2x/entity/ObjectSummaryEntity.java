package com.obigo.v2x.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "object_summary_m")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObjectSummaryEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "object_type", nullable = false)
    private String objectType;  // 데이터의 type (예: "정상", "위험" 등)

    @Column(name = "total_count", nullable = false)
    private Integer totalCount;  // 해당 type의 총합계

    @Column(name = "active", nullable = false)
    private Boolean active;  // 통계의 활성 상태 (true = 활성화, false = 비활성화)

    @Column(name = "detecting", nullable = false)
    private Boolean detecting;

    @Column(name = "last_lat")
    private Double lastLat;  // 마지막 발견된 위도

    @Column(name = "last_lng")
    private Double lastLng;  // 마지막 발견된 경도

    @OneToMany(mappedBy = "objectSummaryEntity", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<ObjectEntity> objectEntities = new ArrayList<>();
}