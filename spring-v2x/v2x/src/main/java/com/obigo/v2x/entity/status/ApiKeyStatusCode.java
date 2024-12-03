package com.obigo.v2x.entity.status;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="api_key_status_m")
public class ApiKeyStatusCode {
    @Id
    @Column(name="api_stauts_seq")
    private Long statusKey;

    @Column(name="api_stauts_name")
    private String statusName;

    @Column
    private String description;

}
