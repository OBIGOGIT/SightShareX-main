package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto extends BaseTimeEntity {

    private Long userSeq;
    private String userId;
    private String email;
    private String password;
    private String rePassword;
    private String name;
    private Boolean isActive;
    private Integer failCount;
    private String role;
    private String type;
    private LocalDateTime updated;
    private LocalDateTime created;


    public UserDto(User user) {
        this.userSeq = user.getUserSeq();
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.isActive = user.getIsActive();
        this.failCount = user.getFailCount();
        this.role = user.getRole();
        this.type = user.getType();
        this.updated = user.getUpdated();
        this.created = user.getCreated();

    }
}