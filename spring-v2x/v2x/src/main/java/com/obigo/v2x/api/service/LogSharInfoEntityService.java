package com.obigo.v2x.api.service;

import com.obigo.v2x.api.entity.LogSharInfoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface LogSharInfoEntityService {

    Optional<LogSharInfoEntity> findById(Long seq);

    Page<LogSharInfoEntity> findAll(Map<String, Object> filter, Pageable pageable);

    List<LogSharInfoEntity> findAll(Sort sort);

    Page<LogSharInfoEntity> findAll(Pageable pageable);

    List<LogSharInfoEntity> findAll();

}

