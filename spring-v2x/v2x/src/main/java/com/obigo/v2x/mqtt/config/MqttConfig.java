package com.obigo.v2x.mqtt.config;//package com.obigo.carbin.mqtt2.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.obigo.v2x.config.CustomizedObjectTypeAdapter;
import com.obigo.v2x.mqtt.entity.TopicEntity;
import com.obigo.v2x.mqtt.repo.TopicRepository;
import com.obigo.v2x.mqtt.sub.MQTTMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.PublishSubscribeChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.Header;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
//
@Configuration
@RequiredArgsConstructor
@Slf4j
public class MqttConfig {

    final private String colon = ":";
    private String subClientId = MqttAsyncClient.generateClientId();
    private String pubClientId = MqttAsyncClient.generateClientId();

    @Value("${mqtt.broker.url}")
    private String broker;

    @Value("${mqtt.broker.port}")
    private String port;

    private final String TCP = "tcp://";

    private final TopicRepository topicRepository;

    private final MQTTMessageService mqttMessageService;

    private String brokerUrl;


    Gson gson = new GsonBuilder().registerTypeAdapterFactory(CustomizedObjectTypeAdapter.FACTORY).setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();
    @Bean
    public MqttConnectOptions mqttConnectOptions() {
        brokerUrl = this.TCP + this.broker + colon + this.port;
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        return options;
    }

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        factory.setConnectionOptions(mqttConnectOptions());
        return factory;
    }


    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound() {
        try {

            MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler(pubClientId, mqttClientFactory()) {
                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                }
            };
            messageHandler.setAsync(true);
            return messageHandler;
        }
        catch (Exception e) {
            log.error("Failed to create MqttPahoMessageHandler: {}", e.getMessage());
            throw new MessagingException("Failed to create MqttPahoMessageHandler", e);
        }

    }

    @MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
    public interface MqttGateway {
        void sendToMqtt(@Header(MqttHeaders.TOPIC) String topic, String data);
    }


    @Bean
    public MessageChannel mqttInputChannel() {

        return new PublishSubscribeChannel();
    }

    @Bean
    public MessageProducer inbound() {
        List<TopicEntity> topicEntityList = topicRepository.findByUseYn(true);

        List<String> topics = new ArrayList<>();
        for(TopicEntity topicEntity : topicEntityList) {
            topics.add(topicEntity.getTopicName());
        }
        String[] test = topics.stream().toArray(String[]::new);

        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(subClientId, mqttClientFactory(), test);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(0);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            String topic = message.getHeaders().get("mqtt_receivedTopic", String.class);
            if (topic == null) {
                throw new MessagingException("No mqtt_receivedTopic header present");
            }

            try {
                mqttMessageService.messageProcess(topic,message.getPayload().toString());
//                JsonObject jsonObject = gson.fromJson(message.getPayload().toString() , JsonObject.class);
//                mqttMessageService.messageProcess(topic,jsonObject);

            } catch (Exception e) {
                e.printStackTrace();
                log.error("messageProcess Error :{}" ,e.getMessage());
            }
        };
    }




}
