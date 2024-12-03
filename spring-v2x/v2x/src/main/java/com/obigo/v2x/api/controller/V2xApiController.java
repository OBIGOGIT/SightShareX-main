package com.obigo.v2x.api.controller;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.obigo.v2x.api.entity.LogDangerousObstacleEntity;
import com.obigo.v2x.api.entity.LogSharInfoEntity;
import com.obigo.v2x.api.service.LogDangerousObstacleEntityService;
import com.obigo.v2x.api.service.LogSharInfoEntityService;
import com.obigo.v2x.common.ErrorMessage;
import com.obigo.v2x.common.Result;
import com.obigo.v2x.config.CustomizedObjectTypeAdapter;
import com.obigo.v2x.service.ApiKeyService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Slf4j
public class V2xApiController {

    private final LogSharInfoEntityService logSharInfoEntityService;

    private final LogDangerousObstacleEntityService logDangerousObstacleEntityService;

    private final ApiKeyService apiKeyService;

    @GetMapping("/sharinfo")
    public ResponseEntity<Map<String, Object>> sharinfo(
            HttpServletRequest req,
            HttpServletResponse res,
            @PageableDefault(sort = "logSharInfoSeq", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String apiKey = req.getHeader("api-key");
            if(apiKey == null) {
                resultMap.put("result", Result.FAIL);
                resultMap.put("desc", ErrorMessage.API_NOT_EXISTS);
                return ResponseEntity.status(HttpStatus.OK).body(resultMap);
            }
            if(apiKeyService.getApiKeyEntity(apiKey) == null) {
                resultMap.put("result", Result.FAIL);
                resultMap.put("desc", ErrorMessage.API_NOT_EXISTS);
                return ResponseEntity.status(HttpStatus.OK).body(resultMap);
            }

            Map<String, Object> map = new HashMap<>();
            if(startDate != null) map.put("startDate", startDate);
            if(endDate != null)  map.put("endDate", endDate);
            resultMap.put("result", Result.SUCCESS);
            Page<LogSharInfoEntity> page = logSharInfoEntityService.findAll(map,pageable);
            resultMap.put("data", page.getContent());
            resultMap.put("contentSize",  page.getContent().size());
            resultMap.put("totalPages", page.getTotalPages()-1);
            resultMap.put("totalElements", page.getTotalElements());
        } catch (Exception e) {
            resultMap.put("result", Result.FAIL);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }


    @GetMapping("/obsctacle")
    public ResponseEntity<Map<String, Object>> obsctacle(
            HttpServletRequest req,
            HttpServletResponse res,
            @PageableDefault(sort = "logDangerousObstacleSeq", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String apiKey = req.getHeader("api-key");
            if(apiKey == null) {
                resultMap.put("result", Result.FAIL);
                resultMap.put("desc", ErrorMessage.API_NOT_EXISTS);
                return ResponseEntity.status(HttpStatus.OK).body(resultMap);
            }
            if(apiKeyService.getApiKeyEntity(apiKey) == null) {
                resultMap.put("result", Result.FAIL);
                resultMap.put("desc", ErrorMessage.API_NOT_EXISTS);
                return ResponseEntity.status(HttpStatus.OK).body(resultMap);
            }
            Map<String, Object> map = new HashMap<>();
            if(startDate != null) map.put("startDate", startDate);
            if(endDate != null)  map.put("endDate", endDate);
            resultMap.put("result", Result.SUCCESS);
            Page<LogDangerousObstacleEntity> page = logDangerousObstacleEntityService.findAll(map,pageable);
            resultMap.put("data", page.getContent());
            resultMap.put("contentSize",  page.getContent().size());
            resultMap.put("totalPages", page.getTotalPages()-1);
            resultMap.put("totalElements", page.getTotalElements());
        } catch (Exception e) {
            resultMap.put("result", Result.FAIL);
        }

        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }

}
