package com.obigo.v2x.controller;

import com.obigo.v2x.common.ErrorMessage;
import com.obigo.v2x.common.Result;
import com.obigo.v2x.config.AesUtil;
import com.obigo.v2x.entity.ApiKeyEntity;
import com.obigo.v2x.entity.ObuEntity;
import com.obigo.v2x.entity.User;
import com.obigo.v2x.entity.enums.ApiStatusType;
import com.obigo.v2x.entity.status.ApiKeyStatusCode;
import com.obigo.v2x.service.ApiKeyService;
import com.obigo.v2x.service.ObuEntityService;
import com.obigo.v2x.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    private final UserService userService;


    @RequestMapping(value = "/apikey", method = RequestMethod.GET)
    public ModelAndView performance(Model m) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/main/api/key");
        return mv;
    }


    @GetMapping("/apikey/apikey")
    public ResponseEntity<Map<String, Object>> performance(HttpSession ses, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            Integer pages = Integer.parseInt(req.getParameter("page"));
            Integer perPage = Integer.parseInt(req.getParameter("perPage"));
            PageRequest pageRequest = PageRequest.of(pages-1, perPage, Sort.by("apiKeySeq").descending() );
            Map<String,Object> map = new HashMap<>();
            map.put("active", true);
            map.put("startDate", req.getParameter("startDate"));
            map.put("endDate", req.getParameter("endDate"));
            Page<ApiKeyEntity> page = apiKeyService.findAll(map,pageRequest);
            Map<String,Object> dataMap = new HashMap<>();
            Map<String,Object> paginationMap = new HashMap<>();
            resultMap.put("result", Boolean.TRUE);
            dataMap.put("contents" , page.getContent());
            paginationMap.put("page" , pages);
            paginationMap.put("totalCount" , page.getTotalElements());
            resultMap.put("data", dataMap);
            dataMap.put("pagination" , paginationMap);
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("result", Boolean.FALSE);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }




    @PostMapping("/user/apikey")
    public ResponseEntity<Map<String, Object>> userKey(@AuthenticationPrincipal User user, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();
        try {
            ApiKeyEntity apiKeyEntity = apiKeyService.getApiKey(user);
            resultMap.put("result", Boolean.TRUE);
            resultMap.put("data" , apiKeyEntity);
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("result", Boolean.FALSE);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }


    @PostMapping("/user/apikey/add")
    public ResponseEntity<Map<String, Object>> apikeyUpdate( @AuthenticationPrincipal User user, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            user = userService.getUser(user.getUserSeq());
            ApiKeyEntity findApiKeyEntity = apiKeyService.getApiKey(user);
            UUID uuid = UUID.randomUUID();
            String apiKey = AesUtil.aesCBCEncode(uuid.toString());
            //이미 요청된 api가 있을경우
            if(findApiKeyEntity != null) {
                findApiKeyEntity.setApiKey(apiKey);
                apiKeyService.update(findApiKeyEntity);
            }
            else {
                ApiKeyEntity apiKeyEntity = ApiKeyEntity.builder().build();
                apiKeyEntity.setUser(user);
                apiKeyEntity.setApiKey(apiKey);
                apiKeyEntity.setUseYn(true);
                apiKeyEntity.setStatusKey(ApiStatusType.RECOGNIZE_API.getCode());
                apiKeyEntity.setStatusName(ApiStatusType.RECOGNIZE_API.getName());
                apiKeyService.update(apiKeyEntity);
            }

            resultMap.put("result", Result.SUCCESS);

        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("result", Result.FAIL);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }


    @PostMapping("/user/apikey/delete")
    public ResponseEntity<Map<String, Object>> apikeyDelete( @AuthenticationPrincipal User user, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            user = userService.getUser(user.getUserSeq());
            ApiKeyEntity findApiKeyEntity = apiKeyService.getApiKey(user);
            if(findApiKeyEntity != null) {
                apiKeyService.deleteApiKeyEntity(findApiKeyEntity);
                resultMap.put("result", Result.SUCCESS);
            }
            else {
                resultMap.put("result", Result.FAIL);
            }
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("result", Result.FAIL);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }



}
