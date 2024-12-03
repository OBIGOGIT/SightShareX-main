FROM python:3.6-slim

# 작업 디렉토리 생성
WORKDIR /app

# 시스템 패키지 및 Python 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Python 패키지 요구사항 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY mqtt_subscriber.py .

# 컨테이너 실행 시 실행할 명령
CMD ["python", "mqtt_subscriber.py"]
