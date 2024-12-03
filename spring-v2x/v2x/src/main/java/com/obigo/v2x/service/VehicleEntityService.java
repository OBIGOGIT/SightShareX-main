package com.obigo.v2x.service;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.VehicleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

public interface VehicleEntityService {


    Page<VehicleEntity> findAll(Map<String, Object> filter, Pageable pageable);

    List<VehicleEntity> findAll(Sort sort);

    Page<VehicleEntity> findAll(Pageable pageable);

    VehicleEntity update(VehicleEntity objectEntity);


    List<VehicleEntity> findAll();

}

