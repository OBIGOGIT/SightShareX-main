package com.obigo.v2x.service;

import com.obigo.v2x.entity.ObuEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

public interface ObuEntityService {


    Page<ObuEntity> findAll(Map<String, Object> filter, Pageable pageable);

    List<ObuEntity> findAll(Sort sort);

    Page<ObuEntity> findAll(Pageable pageable);


    ObuEntity update(ObuEntity obuEntity);


    List<ObuEntity> findAll();

    List<ObuEntity> getRecent50Records();

}

