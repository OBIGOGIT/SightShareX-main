import paho.mqtt.client as mqtt
import psycopg2 
import json
from datetime import datetime
import logging
import time
from typing import Dict, Any, Union
from db_config import DB_CONFIG

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# MQTT 설정
MQTT_BROKER = "infocabin.obigo.com"
MQTT_PORT = 1883
MQTT_TOPICS = ["/ego/shar_info", "/ego/shar_info_path", "/ego/shar_info_obstacles", "/ego/shar_info_image", "/ego/communication_performance", "/ego/dangerous_obstacle", 
              "/target/shar_info", "/target/shar_info_path", "/target/shar_info_obstacles", "/target/shar_info_image", "/target/communication_performance", "/target/dangerous_obstacle"]
MQTT_RECONNECT_DELAY = 5

# Car Type 설정
EGO = "EGO"
TARGET = "TARGET"

# 토픽별 테이블 매핑
TOPIC_MAPPING = {
    "/shar_info": {
        'table': 'log_shar_info_h',
        'query': """
            INSERT INTO log_shar_info_h 
            (latitude, longitude, heading, velocity, type, car_type) 
            VALUES (%(latitude)s, %(longitude)s, %(heading)s, %(velocity)s, %(type)s, %(car_type)s)
        """
    },
    "/shar_info_path": {
        'table': 'log_shar_info_path_h',
        'query': """
            INSERT INTO log_shar_info_path_h 
            (path, car_type) 
            VALUES (%(path)s, %(car_type)s)
        """
    },
    "/shar_info_obstacles": {
        'table': 'log_shar_info_obstacles_h',
        'query': """
            INSERT INTO log_shar_info_obstacles_h 
            (obs_latitude, obs_longitude, heading, car_type) 
            VALUES (%(obs_latitude)s, %(obs_longitude)s, %(heading)s, %(car_type)s)
        """
    },
    "/shar_info_image": {
        'table': 'log_shar_info_image_h',
        'query': """
            INSERT INTO log_shar_info_image_h 
            (image, car_type) 
            VALUES (%(image)s, %(car_type)s)
        """
    },
    "/communication_performance": {
        'table': 'log_communication_performance_h',
        'query': """
            INSERT INTO log_communication_performance_h 
            (comulative_time, distance_between_target, nrtt, speed, packet_size, packet_rate, car_type) 
            VALUES (%(comulative_time)s, %(distance_between_target)s, %(nrtt)s, %(speed)s, %(packet_size)s, %(packet_rate)s, %(car_type)s)
        """
    },
    "/dangerous_obstacle": {
        'table': 'log_dangerous_obstacle_h',
        'query': """
            INSERT INTO log_dangerous_obstacle_h 
            (emergency_type, longitude, latitude, car_type) 
            VALUES (%(emergency_type)s, %(longitude)s, %(latitude)s, %(car_type)s)
        """
    },
}

class MQTTSubscriber:
    def __init__(self):
        self.db_conn = None
        self.cursor = None
        self.client = None
        self.setup_mqtt_client()
        self.setup_db_connection()
        self.last_db_check = datetime.now()

    def setup_db_connection(self):
        """데이터베이스 연결 설정"""
        try:
            if self.db_conn is not None:
                try:
                    self.cursor.close()
                    self.db_conn.close()
                except Exception:
                    pass

            self.db_conn = psycopg2.connect(**DB_CONFIG)
            self.db_conn.autocommit = True
            self.cursor = self.db_conn.cursor()
            logging.info("Database connected successfully")
        except psycopg2.Error as err:
            logging.error(f"Database connection failed: {err}")
            raise

    def check_db_connection(self) -> bool:
        try:
            if (datetime.now() - self.last_db_check).total_seconds() > 3600:
                self.cursor.execute("SELECT 1")
                self.last_db_check = datetime.now() 
            return True
        except Exception:
            logging.warning("Database connection lost, attempting to reconnect...")
            try:
                self.setup_db_connection()
                return True
            except Exception as e:
                logging.error(f"Failed to reconnect to database: {e}")
                return False

    def setup_mqtt_client(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.connect_mqtt()

    def connect_mqtt(self):
        while True:
            try:
                self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
                logging.info("MQTT client connected")
                break
            except Exception as e:
                logging.error(f"MQTT connection failed: {e}")
                logging.info(f"Retrying in {MQTT_RECONNECT_DELAY} seconds...")
                time.sleep(MQTT_RECONNECT_DELAY)

    def on_disconnect(self, client, userdata, rc):
        logging.warning(f"Disconnected from MQTT broker with code: {rc}")
        if rc != 0:
            self.connect_mqtt()

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logging.info("Connected to MQTT broker")
            for topic in MQTT_TOPICS:
                client.subscribe(topic)
                logging.info(f"Subscribed to {topic}")
        else:
            logging.error(f"Connection failed with code {rc}")
            self.connect_mqtt()

    def parse_payload(self, topic: str, payload: Dict[str, Any]) -> Union[Dict[str, Any], str]:
        """페이로드 파싱 및 검증"""
        try:
            # topic에서 ego와 target 분리
            if topic.startswith("/ego"):
                prefix = "/ego"
                suffix = topic[len(prefix):]
                carType = "EGO"
            elif topic.startswith("/target"):
                prefix = "/target"
                suffix = topic[len(prefix):]
                carType = "TARGET"
            else:
                logging.error(f"Input does not start with /ego or /target")
            
            if suffix == "/shar_info":
                required_fields = ['latitude', 'logitude', 'heading', 'velocity', 'type']
                missing_fields = [field for field in required_fields if field not in payload]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {missing_fields}")
                return {
                    'latitude': float(payload['latitude']),
                    'longitude': float(payload['logitude']),
                    'heading': float(payload['heading']),
                    'velocity': float(payload['velocity']),
                    'type': str(payload['type']),
                    'car_type': str(carType)
                }
            elif suffix == "/shar_info_path":
                required_fields = ['path']
                missing_fields = [field for field in required_fields if field not in payload]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {missing_fields}")
                return {
                    'path': str(payload['path']),
                    'car_type': str(carType)
                }
            elif suffix == "/shar_info_obstacles":
                required_fields = ['obs_latitude', 'obs_longitude', 'heading']
                missing_fields = [field for field in required_fields if field not in payload]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {missing_fields}")
                return {
                    'obs_latitude': float(payload['obs_latitude']),
                    'obs_longitude': float(payload['obs_longitude']),
                    'heading': str(payload['heading']),
                    'car_type': str(carType)
                }
            elif suffix == "/shar_info_image":
                required_fields = ['image']
                missing_fields = [field for field in required_fields if field not in payload]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {missing_fields}")
                return {
                    'image': str(payload['image']),
                    'car_type': str(carType)
                }
            elif suffix == "/communication_performance":
                required_fields = ['comulative_time', 'distance_between_target', 'nrtt', 'speed', 'packet_size', 'packet_rate']
                missing_fields = [field for field in required_fields if field not in payload]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {missing_fields}")
                return {
                    'comulative_time': str(payload['comulative_time']),
                    'distance_between_target': float(payload['distance_between_target']),
                    'nrtt': float(payload['nrtt']),
                    'speed': float(payload['speed']),
                    'packet_size': int(payload['packet_size']),
                    'packet_rate': int(payload['packet_rate']),
                    'car_type': str(carType)
                }
            elif suffix == "/dangerous_obstacle":
                required_fields = ['emergency_type', 'longitude', 'latitude']
                missing_fields = [field for field in required_fields if field not in payload]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {missing_fields}")
                return {
                    'emergency_type': str(payload['emergency_type']),
                    'longitude': float(payload['longitude']),
                    'latitude': float(payload['latitude']),
                    'car_type': str(carType)
                }
        except (KeyError, ValueError, TypeError) as e:
            logging.error(f"Payload parsing error: {e}")
            raise ValueError(f"Invalid payload format: {e}")

    def save_to_db(self, topic: str, payload: Dict[str, Any]):
        """토픽별로 해당하는 테이블에 데이터 저장"""
        try:
            if not self.check_db_connection():
                logging.error("Cannot save to database - connection unavailable")
                return
                
            base_topic = '/' + topic.split('/', 2)[-1]

            config = TOPIC_MAPPING.get(base_topic)
            if config is None:
                logging.warning(f"No matching table found for topic: {topic}")
                return

            parsed_data = self.parse_payload(topic, payload)
            self.cursor.execute(config['query'], parsed_data)
            
            logging.info(f"Data saved to {config['table']}: {parsed_data}")

        except psycopg2.Error as err:
            logging.error(f"Database error: {err}")
            self.setup_db_connection()
        except Exception as e:
            logging.error(f"Error saving data: {e}")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            self.save_to_db(msg.topic, payload)
        except json.JSONDecodeError as e:
            logging.error(f"JSON decode error for payload: {msg.payload}, Error: {e}")
        except Exception as e:
            logging.error(f"Error processing message: {e}")

    def run(self):
        try:
            logging.info("Starting MQTT subscriber...")
            self.client.loop_forever()
        except KeyboardInterrupt:
            logging.info("Shutting down...")
            self.cleanup()
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            self.cleanup()

    def cleanup(self):
        try:
            if self.client:
                self.client.disconnect()
            if self.cursor:
                self.cursor.close()
            if self.db_conn:
                self.db_conn.close()
            logging.info("Cleanup completed")
        except Exception as e:
            logging.error(f"Error during cleanup: {e}")

if __name__ == "__main__":
    subscriber = MQTTSubscriber()
    subscriber.run()