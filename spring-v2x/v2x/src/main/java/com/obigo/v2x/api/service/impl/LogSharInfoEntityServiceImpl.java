package com.obigo.v2x.api.service.impl;

import com.obigo.v2x.api.entity.LogDangerousObstacleEntity;
import com.obigo.v2x.api.entity.LogSharInfoEntity;
import com.obigo.v2x.api.repo.LogSharInfoEntityRepository;
import com.obigo.v2x.api.service.LogSharInfoEntityService;
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
public class LogSharInfoEntityServiceImpl implements LogSharInfoEntityService {

    private final LogSharInfoEntityRepository logSharInfoEntityRepository;
    @Override
    public Optional<LogSharInfoEntity> findById(Long seq) {
        return Optional.empty();
    }

    @Override
    public Page<LogSharInfoEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return logSharInfoEntityRepository.findAll(searchObject(filter),pageable);
    }

    @Override
    public List<LogSharInfoEntity> findAll(Sort sort) {
        return null;
    }

    @Override
    public Page<LogSharInfoEntity> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public List<LogSharInfoEntity> findAll() {
        return null;
    }

    public Specification<LogSharInfoEntity> searchObject(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "seq":
                        Predicate seqPredicate = cb.equal(root.get("logSharInfoSeq").as(Long.class), value);
                        predicates.add(seqPredicate);
                        break;
                    case "type":
                        Predicate objectTypePredicate = cb.equal(root.get("type").as(String.class), value);
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
