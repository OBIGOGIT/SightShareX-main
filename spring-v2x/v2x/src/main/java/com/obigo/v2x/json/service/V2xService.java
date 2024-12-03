package com.obigo.v2x.json.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.obigo.v2x.config.CustomizedObjectTypeAdapter;
import com.obigo.v2x.json.entity.V2xEntity;
import com.obigo.v2x.json.repo.V2xEntityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class V2xService {

    private final V2xEntityRepository v2xEntityRepository;
    private final String DATA_DIRECTORY = "D:\\v2x\\20231011\\20231011\\car2";
    private Gson gson = new GsonBuilder().registerTypeAdapterFactory(CustomizedObjectTypeAdapter.FACTORY).setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();

    public void insertTest() {
        String path = null;
        try {
            File dir = new File(DATA_DIRECTORY);
            String[] filenames = dir.list();
            for (String filename : filenames) {
                path = DATA_DIRECTORY +"\\"+filename;
                JSONParser parser = new JSONParser();

                Reader reader = new FileReader(path);

                Object obj = parser.parse(reader);

                JSONObject jsonobj = (JSONObject) obj;

                Type type = new TypeToken<Map<String,Object>>(){}.getType();
                Map<String, Object> jsonData = gson.fromJson(gson.toJson(jsonobj), type);


                String timeStr = String.valueOf(jsonData.get("timestamp")).substring(0,16);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd.HH:mm");
                LocalDateTime dateTime = LocalDateTime.parse(timeStr, formatter);
                V2xEntity v2xEntity = V2xEntity
                        .builder()
                        .carName("car2")
                        .carData(jsonData)
                        .created(dateTime)
                        .build();
//                v2xEntityRepository.save(v2xEntity);
//                log.info("ASDASD :{}" , v2xEntity);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

    }



}
