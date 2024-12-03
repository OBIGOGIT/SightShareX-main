package com.obigo.v2x.mqtt.common;

import lombok.Getter;

@Getter
public enum MQTT_SERVICE_TOPIC {

    WEB_SOCKET_TOPIC("/shar_total"),
    EGO_SHAR_INFO("/ego/shar_info"),
    EGO_SHAR_INFO_PATH("/ego/shar_info_path"),
    EGO_SHAR_INFO_OBSTACLES("/ego/shar_info_obstacles"),
    EGO_COMMUNICATION_PERFORMANCE("/ego/communication_performance"),
    EGO_SHAR_INFO_IMAGE("/ego/shar_info_image"),
    EGO_DANGEROUS_OBSTACLE("/ego/dangerous_obstacle"),
    TARGET_SHAR_INFO("/target/shar_info"),
    TARGET_SHAR_INFO_PATH("/target/shar_info_path"),
//    TARGET_SHAR_INFO_OBSTACLES("/target/shar_info_obstacles"),
    TARGET_COMMUNICATION_PERFORMANCE("/target/communication_performance");
//    TARGET_SHAR_INFO_IMAGE("/target/shar_info_image"),
//    TARGET_DANGEROUS_OBSTACLE("/target/dangerous_obstacle");

    private String receiveTopic;

    MQTT_SERVICE_TOPIC(String receiveTopic) {
        this.receiveTopic = receiveTopic;
    }

}
