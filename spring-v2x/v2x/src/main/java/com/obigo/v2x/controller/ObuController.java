package com.obigo.v2x.controller;

import com.obigo.v2x.common.Result;
import com.obigo.v2x.entity.ObjectSummaryEntity;
import com.obigo.v2x.entity.ObuEntity;
import com.obigo.v2x.service.ObuEntityService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
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
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ObuController {
    private final ObuEntityService obuEntityService;


    @RequestMapping(value = "/performance", method = RequestMethod.GET)
    public ModelAndView performance(Model m) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/main/performance/performance");
        return mv;
    }


    @PostMapping("/obu/data")
    public ResponseEntity<Map<String, Object>> data(HttpSession ses, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            List<ObuEntity> list = obuEntityService.getRecent50Records();
            Map<String, List<ObuEntity>> groupedAndSortedByOubId = list.stream().collect(Collectors.groupingBy(
                    ObuEntity::getOubId,
                    Collectors.collectingAndThen(
                            Collectors.toList(),
                            lists -> lists.stream()
                                    .sorted(Comparator.comparing(ObuEntity::getSeq))
                                    .collect(Collectors.toList())
                    )
            ));
            resultMap.put("result", Result.SUCCESS);
            resultMap.put("data", groupedAndSortedByOubId);
        } catch (Exception e) {
            resultMap.put("result", Result.FAIL);
        }

        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
    }


    @GetMapping("/performance/performance")
    public ResponseEntity<Map<String, Object>> performance(HttpSession ses, HttpServletRequest req, HttpServletResponse res) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json");
        Map<String, Object> resultMap = new HashMap<>();

        try {
            Integer pages = Integer.parseInt(req.getParameter("page"));
            Integer perPage = Integer.parseInt(req.getParameter("perPage"));
            PageRequest pageRequest = PageRequest.of(pages-1, perPage, Sort.by("seq").descending() );
            Map<String,Object> map = new HashMap<>();
            map.put("active", true);
            map.put("startDate", req.getParameter("startDate"));
            map.put("endDate", req.getParameter("endDate"));
            Page<ObuEntity> page = obuEntityService.findAll(map,pageRequest);
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


//    @PostMapping("/performance/performance")
//    public ResponseEntity<Map<String, Object>> performance(HttpSession ses, HttpServletRequest req, HttpServletResponse res, @SortDefault.SortDefaults({
//            @SortDefault(sort = "seq", direction = Sort.Direction.DESC)
//    })
//    Pageable pageable) {
//        res.setCharacterEncoding("UTF-8");
//        res.setContentType("application/json");
//        Map<String, Object> resultMap = new HashMap<>();
//
//        try {
//            log.info("req : {}" ,req.getParameter("created"));
//            log.info("search : {}" ,req.getParameter("search"));
//            log.info("pageable : {}" ,pageable);
//            Map<String,Object> map = new HashMap<>();
//            map.put("active", true);
//            Page<ObuEntity> page = obuEntityService.findAll(map,pageable);
//            Map<String,Object> dataMap = new HashMap<>();
//            Map<String,Object> paginationMap = new HashMap<>();
//            resultMap.put("result", Boolean.TRUE);
//            dataMap.put("contents" , page.getContent());
//            paginationMap.put("page" , 1);
//            paginationMap.put("totalCount" , page.getTotalElements());
//            resultMap.put("data", dataMap);
//            dataMap.put("pagination" , paginationMap);
//            resultMap.put("recordsTotal", page.getTotalElements());
//            resultMap.put("recordsFiltered", page.getTotalElements());
//        } catch (Exception e) {
//            resultMap.put("result", Result.FAIL);
//        }
//        return ResponseEntity.status(HttpStatus.OK).body(resultMap);
//    }



}
