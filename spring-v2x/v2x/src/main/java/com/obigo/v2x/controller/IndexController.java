package com.obigo.v2x.controller;

import com.obigo.v2x.common.Result;
import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObjectImageEntity;
import com.obigo.v2x.entity.ObuEntity;
import com.obigo.v2x.mqtt.sub.MQTTMessageService;
import com.obigo.v2x.repo.ObjectEntityRepository;
import com.obigo.v2x.repo.ObjectImageEntityRepository;
import com.obigo.v2x.repo.ObjectSummaryRepository;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.service.ObuEntityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

@Controller
@RequiredArgsConstructor
@Slf4j
public class IndexController {

    private final ObjectEntityService objectEntityService;

    private final ObjectImageEntityRepository objectImageEntityRepository;

    private final ObjectEntityRepository objectEntityRepository;

    private final ObjectSummaryRepository objectSummaryRepository;

    private final MQTTMessageService mqttMessageService;


    @RequestMapping(value = "/all/delete", method = RequestMethod.GET)
    @ResponseBody
    public String index() {
        objectImageEntityRepository.deleteAll();
        objectEntityRepository.deleteAll();
        objectSummaryRepository.deleteAll();
        objectEntityService.removeToQueue();
        mqttMessageService.initMap();
        return "delete All";
    }


    @RequestMapping(value = "/front", method = RequestMethod.GET)
    public ModelAndView front(Model m) {
        log.debug("Map page start...");

        ModelAndView mv = new ModelAndView();

        mv.setViewName("/front/front");
        return mv;
    }

    @RequestMapping(value = "/main", method = RequestMethod.GET)
    public ModelAndView front2(Model m) {
        log.debug("Map page start...");

        ModelAndView mv = new ModelAndView();


        mv.setViewName("/main/dashboard/test");

        return mv;
    }

    @RequestMapping(value = "/main2", method = RequestMethod.GET)
    public ModelAndView front3(Model m) {
        log.debug("Map page start...");

        ModelAndView mv = new ModelAndView();

        mv.setViewName("/main/dashboard2");

        return mv;
    }


    @RequestMapping(value = "/api/ping", method = RequestMethod.GET)
    @ResponseBody
    public String ping() {
        return "OK";
    }


}
