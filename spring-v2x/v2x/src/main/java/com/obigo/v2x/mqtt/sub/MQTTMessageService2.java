//package com.obigo.v2x.mqtt.sub;
//
//import com.google.gson.Gson;
//import com.google.gson.GsonBuilder;
//import com.google.gson.JsonObject;
//import com.google.gson.reflect.TypeToken;
//import com.obigo.v2x.config.CustomizedObjectTypeAdapter;
//import com.obigo.v2x.config.LocalDateTimeSerializer;
//import com.obigo.v2x.entity.*;
//import com.obigo.v2x.mqtt.common.MQTT_SERVICE_TOPIC;
//import com.obigo.v2x.repo.*;
//import com.obigo.v2x.service.ObjectEntityService;
//import com.obigo.v2x.service.ObjectImageEntityService;
//import com.obigo.v2x.service.ObjectSummaryService;
//import com.obigo.v2x.service.ObuEntityService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.converter.StringMessageConverter;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.scheduling.annotation.EnableScheduling;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
//
//import java.io.BufferedOutputStream;
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.lang.reflect.Type;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.*;
//import java.util.concurrent.ArrayBlockingQueue;
//import java.util.concurrent.BlockingQueue;
//import java.util.concurrent.CopyOnWriteArrayList;
//import java.util.stream.Collectors;
//
//@RequiredArgsConstructor
//@Service
//@Slf4j
//@Configuration
//@EnableScheduling
//public class MQTTMessageService2 {
//
//    @Value("${obigo.path.file}")
//    private String filePath;
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    private final ObjectEntityService objectEntityService;
//
//    private final ObuEntityService obuEntityService;
//
//    private final ObjectImageEntityService objectImageEntityService;
//
//    private final ObjectSummaryService objectSummaryService;
//
//    private final SharInfoRepository sharInfoRepository;
//    private final SharInfoPathRepository sharInfoPathRepository;
//    private final SharInfoObstaclesRepository sharInfoObstaclesRepository;
//
//    private final SharInfoPerformanceRepository sharInfoPerformanceRepository;
//    private final SharInfoImageRepository sharInfoImageRepository;
//    private final DangerousObstacleRepository dangerousObstacleRepository;
//
//    private final String webSockerPreFix = "/topic";
//
//    private String imagePrefix = "/imagePath/";
//
//    private final BlockingQueue<String> egoSharQueue = new ArrayBlockingQueue<>(1);
//    private final BlockingQueue<String> targetSharQueue = new ArrayBlockingQueue<>(1);
//    private final BlockingQueue<String> egoSharPathQueue = new ArrayBlockingQueue<>(1);
//    private final BlockingQueue<String> targetSharPathQueue = new ArrayBlockingQueue<>(1);
//
//    private final BlockingQueue<String> egoSharPerformanceQueue = new ArrayBlockingQueue<>(1);
//    private final BlockingQueue<String> targetSharPerformanceQueue = new ArrayBlockingQueue<>(1);
//
//    private final Map<Long,ObjectSummaryEntity> objectSummaryMap = new HashMap<>();
//    private final Map<Long,ObjectSummaryEntity> objectDangerousMap = new HashMap<>();
//
//
//    Gson gson = new GsonBuilder().registerTypeAdapterFactory(CustomizedObjectTypeAdapter.FACTORY)
//            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer()).setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();
//
//    public String decodeFile(String base64Txt) throws Exception {
//        String fileName = null;
//        try {
//            byte[] decodedBytes = Base64.getDecoder().decode(base64Txt);
//            fileName = "image_"+System.currentTimeMillis()+".jpg";
//            writeByteArraysToFile(fileName, decodedBytes);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return fileName;
//    }
//
//    public void writeByteArraysToFile(String fileName, byte[] content)  {
//        try {
//            String fileFullPath = filePath + fileName;
//            File file = new File(fileFullPath);
//            BufferedOutputStream writer = new BufferedOutputStream(new FileOutputStream(file));
//            writer.write(content);
//            writer.flush();
//            writer.close();
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//        }
//
//    }
//
//    private void updateQueue(BlockingQueue<String> queue, String message) {
//        if (queue.remainingCapacity() == 0) {  // 큐가 꽉 찬 경우
//            queue.poll();  // 기존 메시지를 제거
//        }
//        queue.offer(message);  // 새 메시지 추가
//    }
//
//    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
//
//    // 클라이언트가 연결할 수 있는 SSE 엔드포인트
//    public SseEmitter createSseConnection() {
//        // 타임아웃을 0으로 설정하여 무제한 연결 유지
//        SseEmitter emitter = new SseEmitter(0L);
//        emitters.add(emitter);
//
//        emitter.onCompletion(() -> emitters.remove(emitter));
//        emitter.onTimeout(() -> emitters.remove(emitter));
//
//        return emitter;
//    }
//
//    private void sendSseData(String data) {
//        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
//        for (SseEmitter emitter : emitters) {
//            try {
//                emitter.send(SseEmitter.event().data(data));
//            } catch (IOException e) {
//                deadEmitters.add(emitter); // 연결이 끊어진 경우
//            }
//        }
//        emitters.removeAll(deadEmitters);
//    }
//
//    @Scheduled(fixedRate = 200) // 100ms 주기로 실행
//    public void processAndSendCombinedData() {
//        processDataAsync(); // 비동기 메서드 호출
//    }
//
//    @Async // 비동기 실행을 지정
//    public void processDataAsync() {
//        String egoData = egoSharQueue.poll();
//        String targetData = targetSharQueue.poll();
//        String egoPathData = egoSharPathQueue.poll();
//        String targetPathData = targetSharPathQueue.poll();
//        String egoSharPerformanceData = egoSharPerformanceQueue.poll();
//        String targetSharPerformanceData = targetSharPerformanceQueue.poll();
//
//        if (egoData == null && targetData == null
//                && egoPathData == null && targetPathData == null
//                && egoSharPerformanceData == null && targetSharPerformanceData == null) {
//            return;
//        }
//        Map<String, JsonObject> dataMap = new HashMap<>();
//        dataMap.putIfAbsent("ego", gson.fromJson(egoData, JsonObject.class));
//        dataMap.putIfAbsent("target", gson.fromJson(targetData, JsonObject.class));
////        dataMap.putIfAbsent("egoPath", gson.fromJson(egoPathData, JsonObject.class));
////        dataMap.putIfAbsent("targetPath", gson.fromJson(targetPathData, JsonObject.class));
////        dataMap.putIfAbsent("egoSharPerformanceData", gson.fromJson(egoSharPerformanceData, JsonObject.class));
////        dataMap.putIfAbsent("targetSharPerformanceData", gson.fromJson(targetSharPerformanceData, JsonObject.class));
//        String jsonString = gson.toJson(dataMap);
//        sendSseData(jsonString);
////        String sendTopic = webSockerPreFix + MQTT_SERVICE_TOPIC.WEB_SOCKET_TOPIC.getReceiveTopic();
////        sendWebSocket(sendTopic, jsonString);
//    }
//
//    public List<ObjectSummaryEntity> findAllActiveSummaries(double latitude, double longitude, double distanceInMeters) {
//        return objectSummaryMap.values().stream() // Map의 값들만 스트림으로 가져옴
//                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) < distanceInMeters
//                        && !summary.getDetecting() && !summary.getActive())
//                .collect(Collectors.toList());
//    }
//
//    public List<ObjectSummaryEntity> findOutside5mAndDetectingFalseAndActiveFalse(double latitude, double longitude, double distanceInMeters) {
//        return objectSummaryMap.values().stream() // Map의 값들로 스트림 생성
//                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) >= distanceInMeters
//                        && !summary.getDetecting() && !summary.getActive()) // 5미터 이상 거리 및 상태 조건 확인
//                .collect(Collectors.toList());
//    }
//
//    @Async
//    public void processOutsideAndNearbySummaries(String message) {
//
//        JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
//        double latitude = jsonObject.get("latitude").getAsDouble();
//        double longitude = jsonObject.get("logitude").getAsDouble();
//        String type = jsonObject.get("type").getAsString();
//
//        if ("정상".equals(type)) {
//            List<ObjectSummaryEntity> outsideSummaries = findAllActiveSummaries(latitude, longitude, 10.0);
//            if (!outsideSummaries.isEmpty()) {
//                // 5미터 반경 밖의 데이터가 존재하는 경우, Detecting 업데이트
//                for (ObjectSummaryEntity outsideSummary : outsideSummaries) {
//                    outsideSummary.setDetecting(false);  // 감지 종료
//                    objectSummaryService.save(outsideSummary);  // 업데이트
//                }
//            }
//            // 5미터 반경 내에 있는 ObjectSummaryEntity 리스트 조회
//            List<ObjectSummaryEntity> nearbySummaries = findOutside5mAndDetectingFalseAndActiveFalse(latitude, longitude, 10.0);
//            if (!nearbySummaries.isEmpty()) {
//                // 5미터 반경 내의 데이터가 존재하는 경우, 각 데이터를 처리
//                for (ObjectSummaryEntity nearbySummary : nearbySummaries) {
//                    nearbySummary.setActive(true);     // 활성화 상태
//                    nearbySummary.setDetecting(false);     // 감지 상태 업데이트
//                    objectSummaryService.save(nearbySummary);  // 업데이트
//                    JsonObject sendJson = new JsonObject();
//                    sendJson.addProperty("id", nearbySummary.getId());
//                    // sendWebSocket 호출 가능
//                    // sendWebSocket(sendDeleteTopic, gson.toJson(sendJson));
//                }
//            }
//        }
//    }
//
//    public void messageProcess(String topic, String message) throws Exception {
//        if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO.getReceiveTopic())) {
//
//            updateQueue(egoSharQueue, message);
//            // 비동기 메서드 호출
//            processOutsideAndNearbySummaries(message);
//        }
//        else if(topic.equals(MQTT_SERVICE_TOPIC.TARGET_SHAR_INFO.getReceiveTopic())) {
//            updateQueue(targetSharQueue, message);
//        }
//        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_PATH.getReceiveTopic())) {
//            updateQueue(egoSharPathQueue, message);
//        }
//        else if (topic.equals(MQTT_SERVICE_TOPIC.TARGET_SHAR_INFO_PATH.getReceiveTopic())) {
//            updateQueue(targetSharPathQueue, message);
//        }
//        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_COMMUNICATION_PERFORMANCE.getReceiveTopic())) {
//
//            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
//            LocalDateTime now = LocalDateTime.now();
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
//            String formattedDateTime = now.format(formatter);
//            jsonObject.addProperty("created", formattedDateTime);
//            updateQueue(egoSharPerformanceQueue, gson.toJson(jsonObject));
//        }
//        else if (topic.equals(MQTT_SERVICE_TOPIC.TARGET_COMMUNICATION_PERFORMANCE.getReceiveTopic())) {
//
//            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
//            LocalDateTime now = LocalDateTime.now();
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
//            String formattedDateTime = now.format(formatter);
//            jsonObject.addProperty("created", formattedDateTime);
//            updateQueue(targetSharPerformanceQueue, gson.toJson(jsonObject));
//        }
//        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_IMAGE.getReceiveTopic())) {
//            // 1. 대기 중인 위치 정보와 매핑
//            String sendGridTopic = webSockerPreFix + "/grid";
//            String sendImageTopic = webSockerPreFix + "/image";
//            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
//            while (!objectEntityService.isQueueEmpty()) {
//                ObjectEntity objectEntity = objectEntityService.getNextLocationData();
//                String base64Txt = jsonObject.get("image").getAsString();
//                String fileName = decodeFile(base64Txt);
//                ObjectImageEntity objectImageEntity = saveObjectImage(fileName,objectEntity.getSeq());
//                if (objectEntity == null) return;
//                Optional<ObjectEntity> findObjectEntity = objectEntityService.findById(objectEntity.getSeq());
//                if (!findObjectEntity.isPresent()) return;
//                objectEntity = findObjectEntity.get();
//                objectEntity.setObjectImageEntity(objectImageEntity);
//                objectEntityService.update(objectEntity);
//                // 2. 5미터 안쪽의 활성화된 합산 데이터가 있는지 조회
//                List<ObjectSummaryEntity> summaryEntities = objectSummaryService.findByObjectTypeAndActiveTrue(objectEntity);
//                JsonObject sendJson = new JsonObject();
//                if (!summaryEntities.isEmpty()) {
//                    for (ObjectSummaryEntity summaryEntity : summaryEntities) {
//                        if (summaryEntity.getDetecting() == true) {
//                            summaryEntity.setLastLat(objectEntity.getLat());
//                            summaryEntity.setLastLng(objectEntity.getLng());
//                            summaryEntity.setActive(true);  // 활성 상태 유지
//                        } else {
//                            summaryEntity.setTotalCount(summaryEntity.getTotalCount() + 1);
//                            summaryEntity.setDetecting(true);
//                            summaryEntity.setLastLat(objectEntity.getLat());
//                            summaryEntity.setLastLng(objectEntity.getLng());
//                            summaryEntity.setActive(true);  // 활성 상태 유지
//                            sendWebSocket(sendGridTopic,gson.toJson(new JsonObject()));
//                        }
//                        objectEntity.setObjectSummaryEntity(summaryEntity);  // 양방향 관계 설정
//                        summaryEntity.getObjectEntities().add(objectEntity);  // 양방향 관계 설정
//                        objectSummaryService.save(summaryEntity);
//                        objectSummaryMap.put(summaryEntity.getId() , summaryEntity);
//                        sendJson.addProperty("id" , summaryEntity.getId());
//                        sendJson.addProperty("detecting" , summaryEntity.getDetecting());
//                        sendJson.addProperty("active" , summaryEntity.getActive());
//                        sendJson.addProperty("lastLat" , summaryEntity.getLastLat());
//                        sendJson.addProperty("lastLng" , summaryEntity.getLastLng());
//                        sendJson.addProperty("objectType" , objectEntity.getObjectName());
//                        sendJson.addProperty("imagePath" , objectImageEntity.getImagePath());
//                        sendJson.addProperty("count" , summaryEntity.getTotalCount());
//                        sendWebSocket(sendImageTopic, gson.toJson(sendJson));
//                    }
//                }
//                // 2. 5미터 안쪽의 활성화된 합산 데이터가 없을 경우 새로운 오브젝트
//                else {
//                    ObjectSummaryEntity newSummaryEntity = ObjectSummaryEntity.builder()
//                            .objectType(objectEntity.getObjectName())  // ObjectEntity의 이름을 설정
//                            .totalCount(1)  // 총 카운트 1로 초기화
//                            .active(true)  // 활성 상태로 설정
//                            .detecting(true)  // 감지 중 상태로 설정
//                            .lastLat(objectEntity.getLat())  // 마지막 위도 설정
//                            .lastLng(objectEntity.getLng())  // 마지막 경도 설정
//                            .build();
//                    newSummaryEntity= objectSummaryService.save(newSummaryEntity);
//                    objectEntity.setObjectSummaryEntity(newSummaryEntity);  // 양방향 관계 설정
//                    List<ObjectEntity> objectEntities = new ArrayList<>();
//                    objectEntities.add((objectEntity));
//                    newSummaryEntity.setObjectEntities(objectEntities);  // 양방향 관계 설정
//                    objectSummaryService.save(newSummaryEntity);
//                    objectSummaryMap.put(newSummaryEntity.getId() , newSummaryEntity);
//                    sendJson.addProperty("id" , newSummaryEntity.getId());
//                    sendJson.addProperty("detecting" , newSummaryEntity.getDetecting());
//                    sendJson.addProperty("active" , newSummaryEntity.getActive());
//                    sendJson.addProperty("lastLat" , newSummaryEntity.getLastLat());
//                    sendJson.addProperty("lastLng" , newSummaryEntity.getLastLng());
//                    sendJson.addProperty("objectType" , objectEntity.getObjectName());
//                    sendJson.addProperty("imagePath" , objectImageEntity.getImagePath());
//                    sendJson.addProperty("count" , newSummaryEntity.getTotalCount());
//                    sendWebSocket(sendImageTopic, gson.toJson(sendJson));
//                    sendWebSocket(sendGridTopic,gson.toJson(new JsonObject()));
//                }
//            }
//
//        }
//        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_DANGEROUS_OBSTACLE.getReceiveTopic())) {
//            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
//            String emergencyType = jsonObject.get("emergency_type").getAsString();
//            Double lng = jsonObject.get("longitude").getAsDouble();
//            Double lat = jsonObject.get("latitude").getAsDouble();
//            if("정상".equals(emergencyType)) return;
//
//            ObjectEntity objectEntity = ObjectEntity.builder()
//                    .objectName(emergencyType)
//                    .lng(lng)
//                    .lat(lat)
//                    .build();
//            objectEntity = objectEntityService.update(objectEntity);
//
//            objectEntityService.addLocationDataToQueue(objectEntity);
//        }
//    }
//
//
//    public void messageProcess(String topic, JsonObject jsonObject) throws Exception {
//        String sendTopic = webSockerPreFix + topic;
//        String sendImageTopic = webSockerPreFix + "/image";
//        String sendDeleteTopic = webSockerPreFix + "/delete";
//        String sendGridTopic = webSockerPreFix + "/grid";
//
//        Type types = new TypeToken<Map<String,Object>>(){}.getType();
//        Map<String, Object> jsonData = gson.fromJson(gson.toJson(jsonObject), types);
//
//        if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO.getReceiveTopic())
//                || topic.equals(MQTT_SERVICE_TOPIC.TARGET_SHAR_INFO.getReceiveTopic())
//            ) {
//            SharInfo sharInfo = SharInfo.builder()
//                    .topic(topic)
//                    .carData(jsonData)
//                    .build();
//            sharInfoRepository.save(sharInfo);
//            // SHAR_INFO 토픽 처리
//            double latitude = jsonObject.get("latitude").getAsDouble();
//            double longitude = jsonObject.get("logitude").getAsDouble();
//            String type = jsonObject.get("type").getAsString();
//            if ("정상".equals(type)) {
//                List<ObjectSummaryEntity> outsideSummaries = objectSummaryService.findOutside5mAndDetectingFalseAndActiveFalse(latitude, longitude, 10.0);
//                if (!outsideSummaries.isEmpty()) {
//                    // 5미터 반경 밖의 데이터가 존재하는 경우, Detecting 업데이트
//                    for (ObjectSummaryEntity outsideSummary : outsideSummaries) {
//                        outsideSummary.setDetecting(false);  // 감지 종료
//                        objectSummaryService.save(outsideSummary);  // 업데이트
//                    }
//                }
//
//                // 5미터 반경 내에 있는 ObjectSummaryEntity 리스트 조회
//                List<ObjectSummaryEntity> nearbySummaries = objectSummaryService.findOutside5mAndDetecting(latitude, longitude, 10.0);
//                if (!nearbySummaries.isEmpty()) {
//                    // 5미터 반경 내의 데이터가 존재하는 경우, 각 데이터를 처리
//                    for (ObjectSummaryEntity nearbySummary : nearbySummaries) {
//                        nearbySummary.setActive(true);     // 비활성화 상태
//                        nearbySummary.setDetecting(false);     // 비활성화 상태
//                        objectSummaryService.save(nearbySummary);  // 업데이트
//                        JsonObject sendJson = new JsonObject();
//                        sendJson.addProperty("id" , nearbySummary.getId());
////                        sendWebSocket(sendDeleteTopic, gson.toJson(sendJson));
//
//                    }
//                }
//            }
//            sendWebSocket(sendTopic, gson.toJson(jsonObject));
//
//        } else if (
//                topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_PATH.getReceiveTopic())
//                || topic.equals(MQTT_SERVICE_TOPIC.TARGET_SHAR_INFO_PATH.getReceiveTopic())
//        ) {
////            log.info("SHAR_INFO_PATH :{}" , topic);
//            // SHAR_INFO_PATH 토픽 처리 - 웹소켓으로 메시지 전송
//            sendWebSocket(sendTopic, gson.toJson(jsonObject));
//
//        } else if (
//                topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_OBSTACLES.getReceiveTopic())
//
//        ) {
//            // SHAR_INFO_OBSTACLES 토픽 처리 - 장애물 정보 저장 로직
////            saveObject(jsonObject);
//
//            SharInfoObstacles sharInfoObstacles = SharInfoObstacles.builder()
//                    .topic(topic)
//                    .carData(jsonData)
//                    .build();
//
//            sharInfoObstaclesRepository.save(sharInfoObstacles);
//
//        } else if (
//                topic.equals(MQTT_SERVICE_TOPIC.EGO_COMMUNICATION_PERFORMANCE.getReceiveTopic())
//                || topic.equals(MQTT_SERVICE_TOPIC.TARGET_COMMUNICATION_PERFORMANCE.getReceiveTopic())
//        ) {
//
//            SharInfoPerformance sharInfoPerformance = SharInfoPerformance.builder()
//                    .topic(topic)
//                    .carData(jsonData)
//                    .build();
//            sharInfoPerformanceRepository.save(sharInfoPerformance);
//
//
//            // COMMUNICATION_PERFORMANCE 토픽 처리 - 통신 성능 정보 업데이트
//            String obuId = "ego";
//            if(topic.contains("target")) obuId = "target";
//            Double rtt = jsonObject.get("nrtt").getAsDouble();
//            Double speed = jsonObject.get("speed").getAsDouble();
//            Double packetSize = jsonObject.get("packet_size").getAsDouble();
//            Double packetRate = jsonObject.get("packet_rate").getAsDouble();
//
//            ObuEntity obuEntity = ObuEntity.builder()
//                    .oubId(obuId)
//                    .rtt(rtt)
//                    .mbps(speed)
//                    .packetSize(packetSize)
//                    .packetRate(packetRate)
//                    .build();
//
//            // OBU 정보 업데이트
//            obuEntityService.update(obuEntity);
//            sendWebSocket(sendTopic, gson.toJson(obuEntity));
//
//        } else if (
//                topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_IMAGE.getReceiveTopic())
//        ) {
//            SharInfoImage sharInfoImage = SharInfoImage.builder()
//                    .topic(topic)
//                    .carData(jsonData)
//                    .build();
//            sharInfoImageRepository.save(sharInfoImage);
//            // SHAR_INFO_IMAGE 토픽 처리 - 이미지 수신 및 처리
//            // 1. 대기 중인 위치 정보와 매핑
//            while (!objectEntityService.isQueueEmpty()) {
//                ObjectEntity objectEntity = objectEntityService.getNextLocationData();
//                String base64Txt = jsonObject.get("image").getAsString();
//                String fileName = decodeFile(base64Txt);
//                ObjectImageEntity objectImageEntity = saveObjectImage(fileName,objectEntity.getSeq());
//                if (objectEntity == null) return;
//                Optional<ObjectEntity> findObjectEntity = objectEntityService.findById(objectEntity.getSeq());
//                if (!findObjectEntity.isPresent()) return;
//                objectEntity = findObjectEntity.get();
//                objectEntity.setObjectImageEntity(objectImageEntity);
//                objectEntityService.update(objectEntity);
//                // 2. 5미터 안쪽의 활성화된 합산 데이터가 있는지 조회
//                List<ObjectSummaryEntity> summaryEntities = objectSummaryService.findByObjectTypeAndActiveTrue(objectEntity);
//                JsonObject sendJson = new JsonObject();
//                if (!summaryEntities.isEmpty()) {
//                    for (ObjectSummaryEntity summaryEntity : summaryEntities) {
//                        if (summaryEntity.getDetecting() == true) {
//                            summaryEntity.setLastLat(objectEntity.getLat());
//                            summaryEntity.setLastLng(objectEntity.getLng());
//                            summaryEntity.setActive(true);  // 활성 상태 유지
//                        } else {
//                            summaryEntity.setTotalCount(summaryEntity.getTotalCount() + 1);
//                            summaryEntity.setDetecting(true);
//                            summaryEntity.setLastLat(objectEntity.getLat());
//                            summaryEntity.setLastLng(objectEntity.getLng());
//                            summaryEntity.setActive(true);  // 활성 상태 유지
//                            sendWebSocket(sendGridTopic,gson.toJson(new JsonObject()));
//                        }
//                        objectEntity.setObjectSummaryEntity(summaryEntity);  // 양방향 관계 설정
//                        summaryEntity.getObjectEntities().add(objectEntity);  // 양방향 관계 설정
//                        objectSummaryService.save(summaryEntity);
//                        sendJson.addProperty("id" , summaryEntity.getId());
//                        sendJson.addProperty("detecting" , summaryEntity.getDetecting());
//                        sendJson.addProperty("active" , summaryEntity.getActive());
//                        sendJson.addProperty("lastLat" , summaryEntity.getLastLat());
//                        sendJson.addProperty("lastLng" , summaryEntity.getLastLng());
//                        sendJson.addProperty("objectType" , objectEntity.getObjectName());
//                        sendJson.addProperty("imagePath" , objectImageEntity.getImagePath());
//                        sendJson.addProperty("count" , summaryEntity.getTotalCount());
//                        sendWebSocket(sendImageTopic, gson.toJson(sendJson));
//                    }
//                }
//                // 2. 5미터 안쪽의 활성화된 합산 데이터가 없을 경우 새로운 오브젝트
//                else {
//                    ObjectSummaryEntity newSummaryEntity = ObjectSummaryEntity.builder()
//                            .objectType(objectEntity.getObjectName())  // ObjectEntity의 이름을 설정
//                            .totalCount(1)  // 총 카운트 1로 초기화
//                            .active(true)  // 활성 상태로 설정
//                            .detecting(true)  // 감지 중 상태로 설정
//                            .lastLat(objectEntity.getLat())  // 마지막 위도 설정
//                            .lastLng(objectEntity.getLng())  // 마지막 경도 설정
//                            .build();
//                    newSummaryEntity= objectSummaryService.save(newSummaryEntity);
//                    objectEntity.setObjectSummaryEntity(newSummaryEntity);  // 양방향 관계 설정
//                    List<ObjectEntity> objectEntities = new ArrayList<>();
//                    objectEntities.add((objectEntity));
//                    newSummaryEntity.setObjectEntities(objectEntities);  // 양방향 관계 설정
//                    objectSummaryService.save(newSummaryEntity);
//                    sendJson.addProperty("id" , newSummaryEntity.getId());
//                    sendJson.addProperty("detecting" , newSummaryEntity.getDetecting());
//                    sendJson.addProperty("active" , newSummaryEntity.getActive());
//                    sendJson.addProperty("lastLat" , newSummaryEntity.getLastLat());
//                    sendJson.addProperty("lastLng" , newSummaryEntity.getLastLng());
//                    sendJson.addProperty("objectType" , objectEntity.getObjectName());
//                    sendJson.addProperty("imagePath" , objectImageEntity.getImagePath());
//                    sendJson.addProperty("count" , newSummaryEntity.getTotalCount());
//                    sendWebSocket(sendImageTopic, gson.toJson(sendJson));
//                    sendWebSocket(sendGridTopic,gson.toJson(new JsonObject()));
//                }
//            }
//
//
//        } else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_DANGEROUS_OBSTACLE.getReceiveTopic())) {
//
//            DangerousObstacle dangerousObstacle = DangerousObstacle.builder()
//                    .topic(topic)
//                    .carData(jsonData)
//                    .build();
//
//            dangerousObstacleRepository.save(dangerousObstacle);
//            String emergencyType = jsonObject.get("emergency_type").getAsString();
//            Double lng = jsonObject.get("longitude").getAsDouble();
//            Double lat = jsonObject.get("latitude").getAsDouble();
//            if("정상".equals(emergencyType)) return;
//            ObjectEntity objectEntity = ObjectEntity.builder()
//                    .objectName(emergencyType)
//                    .lng(lng)
//                    .lat(lat)
//                    .build();
//
//            objectEntity = objectEntityService.update(objectEntity);
//            objectEntityService.addLocationDataToQueue(objectEntity);
//        }
//    }
//
//
//
//    public ObjectImageEntity saveObjectImage(String fileName , Long objectSeq) {
//        String imagePath = imagePrefix + fileName;
//        ObjectImageEntity objectImageEntity = ObjectImageEntity.builder()
//                .imagePath(imagePath)
//                .objectSeq(objectSeq)
//                .build();
//        return objectImageEntityService.update(objectImageEntity);
//    }
//
//
//    public void sendWebSocket(String topic, String message) {
//        try {
//            messagingTemplate.setMessageConverter(new StringMessageConverter());
//            messagingTemplate.convertAndSend(topic, message);
//
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//}
