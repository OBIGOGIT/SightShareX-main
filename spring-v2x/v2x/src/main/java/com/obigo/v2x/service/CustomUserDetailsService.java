package com.obigo.v2x.service;

import com.obigo.v2x.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class CustomUserDetailsService {
	
	public UserDetails loadUserByUsername(User user) throws Exception {
		List<SimpleGrantedAuthority> list = new ArrayList<SimpleGrantedAuthority>();
		list.add((new SimpleGrantedAuthority(user.getRole())));
        user.setAuthorities(list);
        return user;
	}
	
	
}
