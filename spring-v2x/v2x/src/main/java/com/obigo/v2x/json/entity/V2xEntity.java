package com.obigo.v2x.json.entity;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="car_h")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class V2xEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="car_seq")
    private long carSeq;

    @Column(name="car_name")
    private String carName;

    @Type(type = "jsonb")
    @Column(name = "car_data", columnDefinition = "jsonb")
    private Map<String, Object> carData = new HashMap<>();

    @Column
    private LocalDateTime created;

}
