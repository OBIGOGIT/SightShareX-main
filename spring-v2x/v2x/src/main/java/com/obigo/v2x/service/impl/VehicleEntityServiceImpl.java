package com.obigo.v2x.service.impl;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.VehicleEntity;
import com.obigo.v2x.repo.ObjectEntityRepository;
import com.obigo.v2x.repo.VehicleEntityRepository;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.service.VehicleEntityService;
import com.obigo.v2x.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleEntityServiceImpl implements VehicleEntityService {

    private final VehicleEntityRepository vehicleEntityRepository;

    @Override
    public Page<VehicleEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return vehicleEntityRepository.findAll(searchObject(filter),pageable);
    }

    @Override
    public List<VehicleEntity> findAll(Sort sort) {
        return vehicleEntityRepository.findAll(sort);
    }

    @Override
    public Page<VehicleEntity> findAll(Pageable pageable) {
        return vehicleEntityRepository.findAll(pageable);
    }

    @Override
    public VehicleEntity update(VehicleEntity vehicleEntity) {
        return vehicleEntityRepository.save(vehicleEntity);
    }

    @Override
    public List<VehicleEntity> findAll() {
        return vehicleEntityRepository.findAll();
    }

    public Specification<VehicleEntity> searchObject(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "vehicleSeq":
                        Predicate vehicleSeqPredicate = cb.equal(root.get("vehicleSeq").as(Long.class), value);
                        predicates.add(vehicleSeqPredicate);
                        break;
                    case "vin":
                        Predicate vinPredicate = cb.equal(root.get("vin").as(String.class), value);
                        predicates.add(vinPredicate);
                        break;

                    case "startDate":
                        Predicate startDatePredicate = cb.greaterThanOrEqualTo(root.get("created"), DateUtil.stringToLocalDateTime(value));
                        predicates.add(startDatePredicate);
                        break;
                    case "endDate":
                        Predicate endDatePredicate = cb.lessThanOrEqualTo(root.get("updated"), DateUtil.stringToLocalDateTime(value));
                        predicates.add(endDatePredicate);
                        break;
                }
            });
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

