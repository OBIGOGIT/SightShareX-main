package com.obigo.v2x.service;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObjectSummaryEntity;
import com.obigo.v2x.entity.ObjectSummaryWithLatestObjectDto;
import com.obigo.v2x.repo.ObjectSummaryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ObjectSummaryService {


    List<ObjectSummaryEntity> findByObjectTypeAndActiveTrue(ObjectEntity objectEntity);

    ObjectSummaryEntity save(ObjectSummaryEntity objectSummaryEntity);

    Page<ObjectSummaryEntity> findAll(Map<String, Object> filter, Pageable pageable);

    List<ObjectSummaryEntity> findByActiveTrue();

    List<ObjectSummaryEntity> findOutside5mAndDetectingFalseAndActiveFalse(double latitude, double longitude, double distanceInMeters);

    List<ObjectSummaryEntity> findOutside5mAndDetecting(double latitude, double longitude, double distanceInMeters);

    List<ObjectSummaryWithLatestObjectDto> findActiveSummariesWithLastObjectAndImage();

}
