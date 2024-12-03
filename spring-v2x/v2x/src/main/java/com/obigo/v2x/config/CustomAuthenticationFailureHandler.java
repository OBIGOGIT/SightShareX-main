package com.obigo.v2x.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;


@Configuration
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

//	@Autowired
//    private MemberService memberService;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException {
        //접속 로그 저장
//        SigninLog signinLog = new SigninLog();
//        signinLog.setIsSuccess(Boolean.FALSE);
//        signinLog.setEmail(request.getParameter("id"));
//        signinLog.setIpAddr(HttpUtil.getClientIp(request));
//        signinLog.setHostName(request.getHeader("Host"));
//        signinLog.setUseragent(request.getHeader("User-Agent"));
//        signinLog.setReferer(request.getHeader("Referer"));
//        insertLogHistory(signinLog);
        try {
            //로그인 실패 시 1초간 대기
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        OutputStream outputStream = response.getOutputStream();
        Map<String, Object> result = new HashMap<>();
//        result.put("result", Result.FAIL.getValue());
        result.put("result", "Fail");
        result.put("message", e.getMessage());
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
