package com.obigo.v2x.entity;

import com.obigo.v2x.entity.extend.BaseTimeEntity;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.Map;


@Entity
@Builder
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
@Table(name="admin_m")
public class User extends BaseTimeEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_seq")
    private Long userSeq;


    @Column(name="user_id", unique = true)
    private String userId;

    @Column(unique = true)
    private String email;

    @Column(name="pw")
    private String password;

    @Column
    private String name;

    @Column(name="is_active")
    private Boolean isActive;

    @Column(name="fail_count")
    private Integer failCount;

    @Column
    private String token;

    @Column
    private String refreshToken;

    @Transient
    private Collection<SimpleGrantedAuthority> authorities;

    @Column
    private String type;

    @Column
    private String role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getUsername() {
        return this.name;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}