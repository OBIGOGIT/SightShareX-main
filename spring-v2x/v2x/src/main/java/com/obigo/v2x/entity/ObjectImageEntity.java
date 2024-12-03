package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name ="object_image_path_m")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObjectImageEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long seq;

    @Column(name="image_path", nullable = false)
    private String imagePath;

    @Column(name ="object_seq")
    private Long objectSeq;


}
