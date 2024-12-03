package com.obigo.v2x.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.obigo.v2x.entity.User;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CustomAuthenticationSucessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

//    public final Integer SESSION_TIMEOUT_IN_SECONDS = 60*60;
    public final Integer SESSION_TIMEOUT_IN_SECONDS = -1;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws  IOException {
        request.getSession().setMaxInactiveInterval(SESSION_TIMEOUT_IN_SECONDS); //타임아웃 시간을 1시간으로

        //접속 로그 저장
        User user = (User) authentication.getPrincipal();
//        SigninLog signinLog = new SigninLog();
//        signinLog.setIsSuccess(Boolean.TRUE);
//        signinLog.setUserSeq(user.getMemberNo());
//        signinLog.setEmail(request.getParameter("id"));
//        signinLog.setIpAddr(HttpUtil.getClientIp(request));
//        signinLog.setHostName(request.getHeader("Host"));
//        signinLog.setUseragent(request.getHeader("User-Agent"));
//        signinLog.setReferer(request.getHeader("Referer"));
//        insertLogHistory(signinLog);
        OutputStream outputStream = response.getOutputStream();
        Map<String, Object> result = new HashMap<>();
//        result.put("result", Result.SUCCESS.getValue());
        result.put("result", "OK");
        if(user.getRole().equals("ROLE_ADMIN")) {
            result.put("url", "/main");
        }
        else {
            result.put("url", "/main");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(outputStream, result);


    }

//    public void insertLogHistory(SigninLog signinLog) {
//    	try {
//			memberService.insertLoginHistory(signinLog);
//		} catch (Exception e) {
//		}
//    }
}
