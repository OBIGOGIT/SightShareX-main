package com.obigo.v2x.controller;

import com.obigo.v2x.common.ErrorMessage;
import com.obigo.v2x.common.Result;
import com.obigo.v2x.entity.User;
import com.obigo.v2x.entity.UserDto;
import com.obigo.v2x.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class LoginController {
	@Value("${json.result.ok}") String resultOk;
	@Value("${json.result.fail}") String resultFail;
	@Value("${json.result.fail1}") String resultFail1;

	private final UserService userService;

	//------------------------------------------------------------
	// menu link
	@RequestMapping(value = "/manage/logout", method = RequestMethod.GET)
	public void logout(HttpSession ses, HttpServletRequest req, HttpServletResponse rep ) {
		log.debug("logout() called...");

		try {
			ses.removeAttribute( "admin_id" );
			ses.invalidate();
//			rep.sendRedirect("/login");
		} catch ( Exception e ) {
			e.printStackTrace();
		}
    }
	

	@GetMapping("/login")
	public ModelAndView login( HttpSession ses,
			HttpServletRequest request,
            HttpServletResponse response
			) throws IOException {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/login");
        return mv;
	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public void index( HttpServletResponse rep) {
		try {
			rep.sendRedirect("/login");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

	}

    @GetMapping("/signup")
    public ModelAndView signup(HttpSession ses, HttpServletRequest request, HttpServletResponse response, Model m) throws IOException {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/signup");
        return mv;
    }

	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signupView(@RequestBody UserDto userDto, HttpServletRequest req, HttpServletResponse res) {
		res.setCharacterEncoding("UTF-8");
		res.setContentType("application/json");
		Map<String, Object> resultMap = new HashMap<>();
		try {
			userService.createUser(userDto);
			resultMap.put("result", Result.SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", Result.FAIL);
		}

		return ResponseEntity.status(HttpStatus.OK).body(resultMap);
	}

	@PostMapping("/check/{userId}")
	public ResponseEntity<Map<String, Object>> findUser(@PathVariable("userId") String userId, HttpServletRequest req, HttpServletResponse res) {
		res.setCharacterEncoding("UTF-8");
		res.setContentType("application/json");
		Map<String, Object> resultMap = new HashMap<>();
		try {
			User user = userService.getUser(userId);
			if(user == null) {
				resultMap.put("result", Result.SUCCESS);
			}
			else {
				resultMap.put("result", Result.FAIL);
				resultMap.put("desc", ErrorMessage.ID_ALREADY_EXISTS.getMessage());
			}
		} catch (Exception e) {
			resultMap.put("result", Result.FAIL);
			resultMap.put("desc", ErrorMessage.SYSTEM_ERROR.getMessage());
		}

		return ResponseEntity.status(HttpStatus.OK).body(resultMap);
	}

}
