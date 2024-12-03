package com.obigo.v2x.api.service.impl;

import com.obigo.v2x.api.entity.LogDangerousObstacleEntity;
import com.obigo.v2x.api.repo.LogDangerousObstacleEntityRepository;
import com.obigo.v2x.api.service.LogDangerousObstacleEntityService;
import com.obigo.v2x.entity.ObjectSummaryEntity;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogDangerousObstacleEntityServiceImpl implements LogDangerousObstacleEntityService {

    private final LogDangerousObstacleEntityRepository logDangerousObstacleEntityRepository;

    @Override
    public Optional<LogDangerousObstacleEntity> findById(Long seq) {
        return logDangerousObstacleEntityRepository.findById(seq);
    }

    @Override
    public Page<LogDangerousObstacleEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return logDangerousObstacleEntityRepository.findAll(searchObject(filter),pageable);
    }

    @Override
    public List<LogDangerousObstacleEntity> findAll(Sort sort) {
        return logDangerousObstacleEntityRepository.findAll(sort);
    }

    @Override
    public Page<LogDangerousObstacleEntity> findAll(Pageable pageable) {
        return logDangerousObstacleEntityRepository.findAll(pageable);
    }

    @Override
    public List<LogDangerousObstacleEntity> findAll() {
        return logDangerousObstacleEntityRepository.findAll();
    }


    public Specification<LogDangerousObstacleEntity> searchObject(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "seq":
                        Predicate seqPredicate = cb.equal(root.get("logDangerousObstacleSeq").as(Long.class), value);
                        predicates.add(seqPredicate);
                        break;
                    case "emergencyType":
                        Predicate objectTypePredicate = cb.equal(root.get("emergencyType").as(Double.class), value);
                        predicates.add(objectTypePredicate);
                        break;
                    case "carType":
                        Predicate carTypePredicate = cb.equal(root.get("carType").as(String.class), value);
                        predicates.add(carTypePredicate);
                        break;
                    case "startDate":
                        Predicate startDatePredicate = cb.greaterThanOrEqualTo(root.get("created"), DateUtil.stringToLocalDateTimeStart(value));
                        predicates.add(startDatePredicate);
                        break;
                    case "endDate":
                        Predicate endDatePredicate = cb.lessThanOrEqualTo(root.get("created"), DateUtil.stringToLocalDateTimeEndOfDay(value));
                        predicates.add(endDatePredicate);
                        break;
                }
            });
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
