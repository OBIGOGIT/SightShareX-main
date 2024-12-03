package com.obigo.v2x.api.controller;

import com.obigo.v2x.mqtt.sub.MQTTMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final MQTTMessageService mqttMessageService;

    /**
     * 특정 타입의 SSE 연결을 생성합니다.
     * @param type "sharInfo", "sharInfoPath", "communicationPerformance" 중 하나의 타입을 입력받습니다.
     * @return SseEmitter - 클라이언트와 SSE 연결을 유지하는 객체
     */
    @GetMapping("/{type}")
    public SseEmitter streamEvents(@PathVariable String type) {
        // 지정된 타입에 대한 SSE 연결 생성 및 반환
        return mqttMessageService.createSseConnection(type);
    }

}
