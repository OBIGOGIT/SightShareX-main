package com.obigo.v2x.service;

import com.obigo.v2x.common.ErrorMessage;
import com.obigo.v2x.entity.User;
import com.obigo.v2x.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service("customAuthenticationProvider")
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {
	protected Logger log = LoggerFactory.getLogger( getClass() );

    private final UserRepository userRepository;

    private final CustomUserDetailsService customUserDetailsService;

//    private final PasswordEncoder passwordEncoder;


	@Bean
	public PasswordEncoder passwordEncoder() {
		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
		return bCryptPasswordEncoder;
	}

	@Override
    @Transactional
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String id = (String) authentication.getPrincipal();
        String password = (String) authentication.getCredentials();
        User user = null;
        UsernamePasswordAuthenticationToken authenticationToken = null;
        String errorMsg = null;
        try {
        	user = userRepository.findByUserId(id);
			//회원유무 확인
	        if(user == null) {
	        	errorMsg = ErrorMessage.AUTHENTICATION_MEMBER_NOT_EXISTS.getMessage();
	        	throw new BadCredentialsException(ErrorMessage.AUTHENTICATION_MEMBER_NOT_EXISTS.getMessage());
	        }
	        if(!passwordEncoder().matches(password, user.getPassword())) {
	        	errorMsg = ErrorMessage.AUTHENTICATION_MEMBER_NOT_EXISTS.getMessage();
	        	throw new BadCredentialsException(ErrorMessage.AUTHENTICATION_MEMBER_NOT_EXISTS.getMessage());
	        }
	        if(!user.getIsActive()) {
	        	errorMsg = ErrorMessage.ID_UNRECEIVED.getMessage();
	        	throw new BadCredentialsException(ErrorMessage.ID_UNRECEIVED.getMessage());
	        }
        	UserDetails users  = (User) customUserDetailsService.loadUserByUsername(user);
	        authenticationToken = new UsernamePasswordAuthenticationToken(users, user.getPassword() ,users.getAuthorities());
	        return authenticationToken;
		}

        catch (Exception e) {
			e.printStackTrace();
			throw new BadCredentialsException(errorMsg);

		}

    }



    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(UsernamePasswordAuthenticationToken.class);
    }
}
