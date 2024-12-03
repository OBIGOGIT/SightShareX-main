package com.obigo.v2x.service;

import com.obigo.v2x.entity.ObjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ObjectEntityService {

    Optional<ObjectEntity> findById(Long seq);

    Page<ObjectEntity> findAll(Map<String, Object> filter, Pageable pageable);

    List<ObjectEntity> findAll(Sort sort);

    Page<ObjectEntity> findAll(Pageable pageable);

    ObjectEntity findByLatAndLng(ObjectEntity objectEntity);

    ObjectEntity update(ObjectEntity objectEntity);

    public ObjectEntity merge(ObjectEntity objectEntity);

    List<ObjectEntity> findAll();

    void addLocationDataToQueue(ObjectEntity objectEntity);

    // 큐에서 가장 오래된 위치 데이터를 가져오는 메서드
    ObjectEntity getNextLocationData();

    ObjectEntity getPeekLocationData();

    void removeToQueue();

    // 큐가 비어 있는지 확인하는 메서드
    boolean isQueueEmpty();

    ObjectEntity findLatestObjectEntityBySummaryId(Long summaryId);

    void updateActiveStatusForNearbyLocations(double latitude, double longitude);

    double calculateDistance(double lat1, double lon1, double lat2, double lon2);
}

