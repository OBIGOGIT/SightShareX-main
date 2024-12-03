package com.obigo.v2x.service.impl;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObjectImageEntity;
import com.obigo.v2x.repo.ObjectImageEntityRepository;
import com.obigo.v2x.service.ObjectImageEntityService;
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
public class ObjectImageEntityServiceImpl implements ObjectImageEntityService {

    private final ObjectImageEntityRepository objectImageEntityRepository;

    @Override
    public Page<ObjectImageEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return objectImageEntityRepository.findAll(searchObjectImage(filter), pageable);
    }

    @Override
    public List<ObjectImageEntity> findAll(Sort sort) {
        return objectImageEntityRepository.findAll(sort);
    }

    @Override
    public Page<ObjectImageEntity> findAll(Pageable pageable) {
        return objectImageEntityRepository.findAll(pageable);
    }

    @Override
    public ObjectImageEntity update(ObjectImageEntity objectImageEntity) {
        return objectImageEntityRepository.save(objectImageEntity);
    }

    @Override
    public List<ObjectImageEntity> findAll() {
        return objectImageEntityRepository.findAll();
    }

    public Specification<ObjectImageEntity> searchObjectImage(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "seq":
                        Predicate seqPredicate = cb.equal(root.get("seq").as(Long.class), value);
                        predicates.add(seqPredicate);
                        break;
                    case "count":
                        Predicate countPredicate = cb.equal(root.get("count").as(Integer.class), value);
                        predicates.add(countPredicate);
                        break;
                    case "lat":
                        Predicate latPredicate = cb.equal(root.get("lat").as(Double.class), value);
                        predicates.add(latPredicate);
                        break;
                    case "lng":
                        Predicate lngPredicate = cb.equal(root.get("lng").as(Double.class), value);
                        predicates.add(lngPredicate);
                        break;
                    case "objectCode":
                        Predicate objectCodePredicate = cb.equal(root.get("objectCode").as(Integer.class), value);
                        predicates.add(objectCodePredicate);
                        break;
                    case "active":
                        Predicate activePredicate = cb.equal(root.get("active").as(Boolean.class), value);
                        predicates.add(activePredicate);
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

