package com.obigo.v2x.mqtt.sub;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.obigo.v2x.config.CustomizedObjectTypeAdapter;
import com.obigo.v2x.config.LocalDateTimeSerializer;
import com.obigo.v2x.entity.*;
import com.obigo.v2x.mqtt.common.MQTT_SERVICE_TOPIC;
import com.obigo.v2x.repo.*;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.service.ObjectImageEntityService;
import com.obigo.v2x.service.ObjectSummaryService;
import com.obigo.v2x.service.ObuEntityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
@Configuration
@EnableScheduling
public class MQTTMessageService {

    @Value("${obigo.path.file}")
    private String filePath;

    private final SimpMessagingTemplate messagingTemplate;

    private final ObjectEntityService objectEntityService;


    private final ObjectImageEntityService objectImageEntityService;

    private final ObjectSummaryService objectSummaryService;


    private final String webSockerPreFix = "/topic";

    private String imagePrefix = "/imagePath/";

    private final BlockingQueue<String> egoSharQueue = new ArrayBlockingQueue<>(1);
    private final BlockingQueue<String> targetSharQueue = new ArrayBlockingQueue<>(1);
    private final BlockingQueue<String> egoSharPathQueue = new ArrayBlockingQueue<>(1);
    private final BlockingQueue<String> targetSharPathQueue = new ArrayBlockingQueue<>(1);

    private final BlockingQueue<String> egoSharPerformanceQueue = new ArrayBlockingQueue<>(1);
    private final BlockingQueue<String> targetSharPerformanceQueue = new ArrayBlockingQueue<>(1);
    private final BlockingQueue<String> egoSharImageQueue = new ArrayBlockingQueue<>(1);
    private final BlockingQueue<String> egoSharGridQueue = new ArrayBlockingQueue<>(1);

    private Map<Long,ObjectSummaryEntity> objectSummaryMap = new HashMap<>();


    Gson gson = new GsonBuilder().registerTypeAdapterFactory(CustomizedObjectTypeAdapter.FACTORY)
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer()).setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();

    public String decodeFile(String base64Txt) throws Exception {
        String fileName = null;
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Txt);
            fileName = "image_"+System.currentTimeMillis()+".jpg";
            writeByteArraysToFile(fileName, decodedBytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileName;
    }

    public void initMap() {
        objectSummaryMap = new HashMap<>();
    }

    public void writeByteArraysToFile(String fileName, byte[] content)  {
        try {
            String fileFullPath = filePath + fileName;
            File file = new File(fileFullPath);
            BufferedOutputStream writer = new BufferedOutputStream(new FileOutputStream(file));
            writer.write(content);
            writer.flush();
            writer.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void updateQueue(BlockingQueue<String> queue, String message) {
        if (queue.remainingCapacity() == 0) {  // 큐가 꽉 찬 경우
            queue.poll();  // 기존 메시지를 제거
        }
        queue.offer(message);  // 새 메시지 추가
    }

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private final List<SseEmitter> sharInfoEmitters = new CopyOnWriteArrayList<>();
    private final List<SseEmitter> sharInfoPathEmitters = new CopyOnWriteArrayList<>();
    private final List<SseEmitter> communicationPerformanceEmitters = new CopyOnWriteArrayList<>();
    private final List<SseEmitter> imagePerformanceEmitters = new CopyOnWriteArrayList<>();
    private final List<SseEmitter> gridPerformanceEmitters = new CopyOnWriteArrayList<>();

    public SseEmitter createSseConnection(String type) {
        SseEmitter emitter = new SseEmitter(0L); // 무제한 연결 유지
        if ("sharInfo".equals(type)) {
            sharInfoEmitters.add(emitter);
        } else if ("sharInfoPath".equals(type)) {
            sharInfoPathEmitters.add(emitter);
        } else if ("communicationPerformance".equals(type)) {
            communicationPerformanceEmitters.add(emitter);
        } else if ("sharInfoImage".equals(type)) {
            imagePerformanceEmitters.add(emitter);
        } else if ("sharInfoGrid".equals(type)) {
            gridPerformanceEmitters.add(emitter);
        }

        emitter.onCompletion(() -> removeEmitter(type, emitter));
        emitter.onTimeout(() -> removeEmitter(type, emitter));
        return emitter;
    }

    private void removeEmitter(String type, SseEmitter emitter) {
        if ("sharInfo".equals(type)) {
            sharInfoEmitters.remove(emitter);
        } else if ("sharInfoPath".equals(type)) {
            sharInfoPathEmitters.remove(emitter);
        } else if ("communicationPerformance".equals(type)) {
            communicationPerformanceEmitters.remove(emitter);
        } else if ("sharInfoImage".equals(type)) {
            imagePerformanceEmitters.remove(emitter);
        } else if ("sharInfoGrid".equals(type)) {
            gridPerformanceEmitters.remove(emitter);
        }
    }

    private void sendSseData(String type, String data) {
        List<SseEmitter> emitters;

        // 기존의 switch-case 구문 대신 if-else 구문 사용
        if ("sharInfo".equals(type)) {
            emitters = sharInfoEmitters;
        } else if ("sharInfoPath".equals(type)) {
            emitters = sharInfoPathEmitters;
        } else if ("communicationPerformance".equals(type)) {
            emitters = communicationPerformanceEmitters;
        } else if("sharInfoImage".equals(type)) {
            emitters = imagePerformanceEmitters;
        } else if("sharInfoGrid".equals(type)) {
            emitters = gridPerformanceEmitters;
        }
        else {
            throw new IllegalArgumentException("Unknown SSE type: " + type);
        }

        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().data(data));
            } catch (IOException e) {
                deadEmitters.add(emitter); // 연결이 끊어진 경우
            }
        }
        emitters.removeAll(deadEmitters);
    }


    @Scheduled(fixedRate = 200) // 200ms 주기로 실행
    public void processAndSendCombinedData() {
        sendCombinedData("sharInfo", egoSharQueue, targetSharQueue);
        sendCombinedData("sharInfoPath", egoSharPathQueue, targetSharPathQueue);
        sendCombinedData("sharInfoImage", egoSharImageQueue);
        sendCombinedData("sharInfoGrid", egoSharGridQueue);
    }

    @Scheduled(fixedRate = 1000) // 200ms 주기로 실행
    public void processAndSendCombinedDataPerformance() {
        sendCombinedData("communicationPerformance", egoSharPerformanceQueue, targetSharPerformanceQueue);
    }


    private void sendCombinedData(String type, BlockingQueue<String> egoQueue) {
        String egoData = egoQueue.poll();
        if (egoData == null) {
            return;
        }

        Map<String, JsonObject> dataMap = new HashMap<>();
        if (egoData != null) {
            dataMap.put("ego", gson.fromJson(egoData, JsonObject.class));
        }

        String combinedData = gson.toJson(dataMap);
        sendSseData(type, combinedData);
    }

    private void sendCombinedData(String type, BlockingQueue<String> egoQueue, BlockingQueue<String> targetQueue) {
        String egoData = egoQueue.poll();
        String targetData = targetQueue.poll();

        if (egoData == null && targetData == null) {
            return;
        }

        Map<String, JsonObject> dataMap = new HashMap<>();
        if (egoData != null) {
            dataMap.put("ego", gson.fromJson(egoData, JsonObject.class));
        }
        if (targetData != null) {
            dataMap.put("target", gson.fromJson(targetData, JsonObject.class));
        }

        String combinedData = gson.toJson(dataMap);
        sendSseData(type, combinedData);
    }


    public Optional<ObjectSummaryEntity> findFirstActiveSummary(String objectType, double latitude, double longitude, double distanceInMeters) {
        return objectSummaryMap.values().stream()
                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) < distanceInMeters
                        && objectType.equals(summary.getObjectType())
                ).findFirst();
    }

    public List<ObjectSummaryEntity> findAllActiveSummaries(double latitude, double longitude, double distanceInMeters) {
        return objectSummaryMap.values().stream() // Map의 값들만 스트림으로 가져옴
                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) < distanceInMeters
                        && !summary.getDetecting() && !summary.getActive())
                .collect(Collectors.toList());
    }

    public List<ObjectSummaryEntity> findOutside5mAndDetectingFalseAndActiveFalse(double latitude, double longitude, double distanceInMeters) {
        return objectSummaryMap.values().stream() // Map의 값들로 스트림 생성
                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) >= distanceInMeters
                        && !summary.getDetecting() && !summary.getActive()) // 5미터 이상 거리 및 상태 조건 확인
                .collect(Collectors.toList());
    }

    @Async
    public void processOutsideAndNearbySummaries(String message) {

        JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
        double latitude = jsonObject.get("latitude").getAsDouble();
        double longitude = jsonObject.get("logitude").getAsDouble();
        String type = jsonObject.get("type").getAsString();

        if ("정상".equals(type)) {
            List<ObjectSummaryEntity> outsideSummaries = findAllActiveSummaries(latitude, longitude, 10.0);
            if (!outsideSummaries.isEmpty()) {
                // 5미터 반경 밖의 데이터가 존재하는 경우, Detecting 업데이트
                for (ObjectSummaryEntity outsideSummary : outsideSummaries) {
                    outsideSummary.setDetecting(false);  // 감지 종료
                    objectSummaryService.save(outsideSummary);  // 업데이트
                }
            }
            // 5미터 반경 내에 있는 ObjectSummaryEntity 리스트 조회
            List<ObjectSummaryEntity> nearbySummaries = findOutside5mAndDetectingFalseAndActiveFalse(latitude, longitude, 10.0);
            if (!nearbySummaries.isEmpty()) {
                // 5미터 반경 내의 데이터가 존재하는 경우, 각 데이터를 처리
                for (ObjectSummaryEntity nearbySummary : nearbySummaries) {
                    nearbySummary.setActive(true);     // 활성화 상태
                    nearbySummary.setDetecting(false);     // 감지 상태 업데이트
                    objectSummaryService.save(nearbySummary);  // 업데이트
                    JsonObject sendJson = new JsonObject();
                    sendJson.addProperty("id", nearbySummary.getId());
                    // sendWebSocket 호출 가능
                    // sendWebSocket(sendDeleteTopic, gson.toJson(sendJson));
                }
            }
        }
    }

    public void messageProcess(String topic, String message) throws Exception {
        if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO.getReceiveTopic())) {

            updateQueue(egoSharQueue, message);
            // 비동기 메서드 호출
            processOutsideAndNearbySummaries(message);
        }
        else if(topic.equals(MQTT_SERVICE_TOPIC.TARGET_SHAR_INFO.getReceiveTopic())) {
            updateQueue(targetSharQueue, message);
        }
        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_PATH.getReceiveTopic())) {
            updateQueue(egoSharPathQueue, message);
        }
        else if (topic.equals(MQTT_SERVICE_TOPIC.TARGET_SHAR_INFO_PATH.getReceiveTopic())) {
            updateQueue(targetSharPathQueue, message);
        }
        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_COMMUNICATION_PERFORMANCE.getReceiveTopic())) {

            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
            String formattedDateTime = now.format(formatter);
            jsonObject.addProperty("created", formattedDateTime);
            updateQueue(egoSharPerformanceQueue, gson.toJson(jsonObject));
        }
        else if (topic.equals(MQTT_SERVICE_TOPIC.TARGET_COMMUNICATION_PERFORMANCE.getReceiveTopic())) {

            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
            String formattedDateTime = now.format(formatter);
            jsonObject.addProperty("created", formattedDateTime);
            updateQueue(targetSharPerformanceQueue, gson.toJson(jsonObject));
        }
        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_SHAR_INFO_IMAGE.getReceiveTopic())) {

            //큐에 저장된 EGO_DANGEROUS_OBSTACLE 정보 확인후
            ObjectEntity objectEntity = objectEntityService.getPeekLocationData();
            //큐에 저장된 정보없거나 이미지 저장 끝난 데이터는 무시
            if(objectEntity == null || objectEntity.isCheck() == true) return;
            objectEntity.setCheck(true);
            //이미지 객체 json변환
            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
            String base64Txt = jsonObject.get("image").getAsString();
            //이미지 파일 저장
            String fileName = decodeFile(base64Txt);
            //이미지 엔티티 저장
            ObjectImageEntity objectImageEntity = saveObjectImage(fileName,objectEntity.getSeq());
            objectEntity.setObjectImageEntity(objectImageEntity);
            JsonObject sendJson = new JsonObject();
            ObjectSummaryEntity foundSummary  = findFirstActiveSummary(objectEntity.getObjectName(), objectEntity.getLat(), objectEntity.getLng(), 10).orElse(null);;
            //최초 등록
            if(foundSummary == null) {
                ObjectSummaryEntity newSummaryEntity = ObjectSummaryEntity.builder()
                        .objectType(objectEntity.getObjectName())  // ObjectEntity의 이름을 설정
                        .totalCount(1)  // 총 카운트 1로 초기화
                        .active(true)  // 활성 상태로 설정
                        .detecting(true)  // 감지 중 상태로 설정
                        .lastLat(objectEntity.getLat())  // 마지막 위도 설정
                        .lastLng(objectEntity.getLng())  // 마지막 경도 설정
                        .build();
                newSummaryEntity = objectSummaryService.save(newSummaryEntity);
                objectEntity = objectEntityService.update(objectEntity);
                objectEntity.setObjectSummaryEntity(newSummaryEntity);
                newSummaryEntity.setObjectEntities(Collections.singletonList(objectEntity));
                objectSummaryService.save(newSummaryEntity);
                objectSummaryMap.put(newSummaryEntity.getId() , newSummaryEntity);
                sendJson.addProperty("id" , newSummaryEntity.getId());
                sendJson.addProperty("detecting" , newSummaryEntity.getDetecting());
                sendJson.addProperty("active" , newSummaryEntity.getActive());
                sendJson.addProperty("lastLat" , newSummaryEntity.getLastLat());
                sendJson.addProperty("lastLng" , newSummaryEntity.getLastLng());
                sendJson.addProperty("objectType" , objectEntity.getObjectName());
                sendJson.addProperty("imagePath" , objectImageEntity.getImagePath());
                sendJson.addProperty("count" , newSummaryEntity.getTotalCount());
                updateQueue(egoSharImageQueue, gson.toJson(sendJson));
                updateQueue(egoSharGridQueue,gson.toJson(new JsonObject()));
            }
            else {
                foundSummary.setTotalCount(foundSummary.getTotalCount() + 1);
                foundSummary.setDetecting(true);
                foundSummary.setLastLat(objectEntity.getLat());
                foundSummary.setLastLng(objectEntity.getLng());
                foundSummary.setActive(true);  // 활성 상태 유지
                updateQueue(egoSharGridQueue,gson.toJson(new JsonObject()));
                objectEntity.setObjectSummaryEntity(foundSummary);
                objectSummaryMap.put(foundSummary.getId() , foundSummary);
            }
        }
        else if (topic.equals(MQTT_SERVICE_TOPIC.EGO_DANGEROUS_OBSTACLE.getReceiveTopic())) {
            JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
            String emergencyType = jsonObject.get("emergency_type").getAsString();
            Double lng = jsonObject.get("longitude").getAsDouble();
            Double lat = jsonObject.get("latitude").getAsDouble();
            if("정상".equals(emergencyType)) return;

            ObjectEntity objectEntity = ObjectEntity.builder()
                    .objectName(emergencyType)
                    .lng(lng)
                    .lat(lat)
                    .check(false)
                    .build();
            objectEntity = objectEntityService.update(objectEntity);

            objectEntityService.addLocationDataToQueue(objectEntity);
        }
    }


    public ObjectImageEntity saveObjectImage(String fileName , Long objectSeq) {
        String imagePath = imagePrefix + fileName;
        ObjectImageEntity objectImageEntity = ObjectImageEntity.builder()
                .imagePath(imagePath)
                .objectSeq(objectSeq)
                .build();
        return objectImageEntityService.update(objectImageEntity);
    }


    public void sendWebSocket(String topic, String message) {
        try {
            messagingTemplate.setMessageConverter(new StringMessageConverter());
            messagingTemplate.convertAndSend(topic, message);

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
