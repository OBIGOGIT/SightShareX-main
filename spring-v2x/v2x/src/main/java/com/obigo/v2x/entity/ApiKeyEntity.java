package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="api_key_m")
public class ApiKeyEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="api_key_seq")
    private Long apiKeySeq;

    @Column
    private String apiKey;

    @Column(name="api_stauts_seq")
    private Long statusKey;

    @Column(name="api_stauts_name")
    private String statusName;

    @Column
    private boolean useYn;

    @OneToOne(targetEntity= User.class, fetch=FetchType.EAGER)
    @JoinColumn(name="user_seq")
    private User user;


}
