package com.obigo.v2x.controller;

import com.obigo.v2x.common.Result;
import com.obigo.v2x.entity.*;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.service.ObjectSummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ObjectController {

    private final ObjectSummaryService objectSummaryService;


    @RequestMapping(value = "/object", method = RequestMethod.GET)
    public ModelAndView object(Model m) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/main/object/object");
        return mv;
    }

    @GetMapping("/object/object")
    public ResponseEntity<Map<String, Object>> object(HttpSession ses, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            Integer pages = Integer.parseInt(req.getParameter("page"));
            Integer perPage = Integer.parseInt(req.getParameter("perPage"));
            PageRequest pageRequest = PageRequest.of(pages-1, perPage, Sort.by("id").descending() );
            Map<String,Object> map = new HashMap<>();
            map.put("startDate", req.getParameter("startDate"));
            map.put("endDate", req.getParameter("endDate"));
            Page<ObjectSummaryEntity> page = objectSummaryService.findAll(map,pageRequest);
            List<ObjectSummaryWithLatestImageDto> list = page.getContent().stream().map(ObjectSummaryWithLatestImageDto::new).collect(Collectors.toList());
            Map<String,Object> dataMap = new HashMap<>();
            Map<String,Object> paginationMap = new HashMap<>();
            resultMap.put("result", Boolean.TRUE);
            dataMap.put("contents" ,list);
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



    @PostMapping("/object/list")
    public ResponseEntity<Map<String, Object>> token(HttpSession ses, HttpServletRequest req, HttpServletResponse res, Pageable pageable) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            Map<String,Object> map = new HashMap<>();
            map.put("active", true);
            Page<ObjectSummaryEntity> page = objectSummaryService.findAll(map,pageable);
            resultMap.put("result", Result.SUCCESS);
            resultMap.put("data", page.getContent());
            resultMap.put("recordsTotal", page.getTotalElements());
            resultMap.put("recordsFiltered", page.getTotalElements());
        } catch (Exception e) {
            resultMap.put("result", Result.FAIL);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }


    @PostMapping("/object/total")
    public ResponseEntity<Map<String, Object>> total(HttpSession ses, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            List<ObjectSummaryWithLatestObjectDto> list = objectSummaryService.findActiveSummariesWithLastObjectAndImage();
            resultMap.put("result", Result.SUCCESS);
            resultMap.put("data", list);
        } catch (Exception e) {
            resultMap.put("result", Result.FAIL);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }
}
