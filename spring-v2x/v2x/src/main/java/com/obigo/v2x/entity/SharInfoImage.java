package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;


@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="shar_info_image_h")
public class SharInfoImage extends BaseTimeEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="seq")
    private long seq;

    @Column(name="topic")
    private String topic;

    @Type(type = "jsonb")
    @Column(name = "data", columnDefinition = "jsonb")
    private Map<String, Object> carData = new HashMap<>();

}
