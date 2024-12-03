package com.obigo.v2x.mqtt.pub;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface MqttOrderGateway {
    void sendToMqtt(String data, @Header(MqttHeaders.TOPIC) String topic);
}