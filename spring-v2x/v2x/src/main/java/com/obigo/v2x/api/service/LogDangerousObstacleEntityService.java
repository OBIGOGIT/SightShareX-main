package com.obigo.v2x.api.service;

import com.obigo.v2x.api.entity.LogDangerousObstacleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface LogDangerousObstacleEntityService {

    Optional<LogDangerousObstacleEntity> findById(Long seq);

    Page<LogDangerousObstacleEntity> findAll(Map<String, Object> filter, Pageable pageable);

    List<LogDangerousObstacleEntity> findAll(Sort sort);

    Page<LogDangerousObstacleEntity> findAll(Pageable pageable);

    List<LogDangerousObstacleEntity> findAll();

}

