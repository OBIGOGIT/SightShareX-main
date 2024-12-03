package com.obigo.v2x.service;

import com.obigo.v2x.entity.ObjectImageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

public interface ObjectImageEntityService {

    Page<ObjectImageEntity> findAll(Map<String, Object> filter, Pageable pageable);
    List<ObjectImageEntity> findAll(Sort sort);
    Page<ObjectImageEntity> findAll(Pageable pageable);
    ObjectImageEntity update(ObjectImageEntity objectImageEntity);
    List<ObjectImageEntity> findAll();

}

