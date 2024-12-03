package com.obigo.v2x.mqtt.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="topic_m")
public class TopicEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="topic_seq")
    private long topicSeq;

    @Column(name="topic_name")
    private String topicName;

    @Column
    private String description;

    @Column
    private boolean useYn;


}