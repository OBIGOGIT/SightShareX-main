package com.obigo.v2x.service.impl;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObuEntity;
import com.obigo.v2x.repo.ObjectEntityRepository;
import com.obigo.v2x.repo.ObuEntityRepository;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.service.ObuEntityService;
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
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ObuEntityServiceImpl implements ObuEntityService {

    private final ObuEntityRepository obuEntityRepository;

    @Override
    public Page<ObuEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return obuEntityRepository.findAll(searchObu(filter), pageable);
    }

    @Override
    public List<ObuEntity> findAll(Sort sort) {
        return obuEntityRepository.findAll(sort);
    }

    @Override
    public Page<ObuEntity> findAll(Pageable pageable) {
        return obuEntityRepository.findAll(pageable);
    }

    @Override
    public ObuEntity update(ObuEntity obuEntity) {
        return obuEntityRepository.save(obuEntity);
    }

    @Override
    public List<ObuEntity> findAll() {
        return obuEntityRepository.findAll();
    }

    @Override
    public List<ObuEntity> getRecent50Records() {
        List<ObuEntity> recentRecords = obuEntityRepository.findTop50ByOubId();

        // 조회한 데이터를 역정렬하여 오름차순으로 변경
        Collections.reverse(recentRecords);

        return recentRecords;
    }

    public Specification<ObuEntity> searchObu(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "oubId":
                        Predicate oubIdPredicate = cb.equal(root.get("oubId").as(String.class), value);
                        predicates.add(oubIdPredicate);
                        break;
                    case "rtt":
                        Predicate rttPredicate = cb.equal(root.get("rtt").as(Double.class), value);
                        predicates.add(rttPredicate);
                        break;
                    case "mbps":
                        Predicate mbpsPredicate = cb.equal(root.get("mbps").as(Double.class), value);
                        predicates.add(mbpsPredicate);
                        break;
                    case "packetSize":
                        Predicate packetSizePredicate = cb.equal(root.get("packetSize").as(Double.class), value);
                        predicates.add(packetSizePredicate);
                        break;
                    case "packetRate":
                        Predicate packetRatePredicate = cb.equal(root.get("packetRate").as(Double.class), value);
                        predicates.add(packetRatePredicate);
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

