package com.obigo.v2x.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {


    private final CustomAuthenticationSucessHandler customAuthenticationSucessHandler;

    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;

    private final AuthenticationProvider authenticationProvider;


    public SecurityConfig(CustomAuthenticationFailureHandler customAuthenticationFailureHandler, CustomAuthenticationSucessHandler customAuthenticationSucessHandler, @Qualifier("customAuthenticationProvider") AuthenticationProvider authenticationProvider) {
        this.customAuthenticationFailureHandler = customAuthenticationFailureHandler;
        this.customAuthenticationSucessHandler = customAuthenticationSucessHandler;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().antMatchers(
                "/api/v1/*",
                "/icon/**",
                "/api/v1/**",
                "/api/v1/test",
                "/css/**",
                "/plugins/**",
                "/dist/**",
                "/bootstrap/**",
                "/images/**",
                "/imagePath/**",
                "/js/**",
                "/fonts/**",
                "/docs/**",
                "/fota/file/**", // fota 관련 예외 허용
                "/appres/**", // mobile 예외 허용
                "/m/**", // mobile 예외 허용
                "/favicon.ico");
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(authenticationProvider);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws
            Exception {
        http
                .antMatcher("/**")
//            .securityMatcher("/*")
                .authorizeRequests()
                .antMatchers("/login", "/api/v1/**","/error", "/signup").permitAll()
                .antMatchers( "/main","/main/**").hasAnyRole("ADMIN","MASTER")
                .antMatchers( "/performance/**","/obu/**", "/object/**").hasAnyRole("USER","ADMIN","MASTER")
                .anyRequest().authenticated().and().httpBasic()

                .disable().cors().and()
                .csrf().disable() //csrf 미적용

                .formLogin()
                .loginPage("/login") //로그인 페이지
                .permitAll()
                .usernameParameter("id")
                .passwordParameter("password")
                .successHandler(customAuthenticationSucessHandler) //로그인 성공 처리
                .failureHandler(customAuthenticationFailureHandler) //로그인 실패 처리
                .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/signout")) //로그아웃 호출 URL
                .logoutSuccessUrl("/") //로그아웃이 성공했을 경우 이동할 페이지
                .invalidateHttpSession(true) /*로그아웃시 세션 제거*/
                .deleteCookies("JSESSIONID") /*쿠키 제거*/
                .clearAuthentication(true) /*권한정보 제거*/
                .permitAll();
        return  http.build();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
        return new ServletListenerRegistrationBean<HttpSessionEventPublisher>(new HttpSessionEventPublisher());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

//        configuration.addAllowedOrigin("*");
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
