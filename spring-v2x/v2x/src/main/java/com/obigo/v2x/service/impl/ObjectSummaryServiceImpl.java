package com.obigo.v2x.service.impl;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObjectSummaryEntity;
import com.obigo.v2x.entity.ObjectSummaryWithLatestObjectDto;
import com.obigo.v2x.entity.ObjectSummaryWithLatestObjectProjection;
import com.obigo.v2x.repo.ObjectEntityRepository;
import com.obigo.v2x.repo.ObjectImageEntityRepository;
import com.obigo.v2x.repo.ObjectSummaryRepository;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.service.ObjectImageEntityService;
import com.obigo.v2x.service.ObjectSummaryService;
import com.obigo.v2x.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ObjectSummaryServiceImpl implements ObjectSummaryService {

    private final ObjectSummaryRepository objectSummaryRepository;

    private final ObjectEntityService objectEntityService;

    private final ObjectEntityRepository objectEntityRepository;

    private final ObjectImageEntityRepository objectImageEntityRepository;


    @Override
    public List<ObjectSummaryEntity> findByObjectTypeAndActiveTrue(ObjectEntity objectEntity) {
        List<ObjectSummaryEntity> list =  objectSummaryRepository.findByObjectTypeAndActiveTrue(objectEntity.getObjectName());
        return list.stream()
                .filter(summary -> objectEntityService.calculateDistance(objectEntity.getLat(), objectEntity.getLng(), summary.getLastLat(), summary.getLastLng()) < 10)  // Detecting = false
                .collect(Collectors.toList());
    }


    @Override
    public ObjectSummaryEntity save(ObjectSummaryEntity objectSummaryEntity) {
        return objectSummaryRepository.save(objectSummaryEntity);
    }

    @Override
    public Page<ObjectSummaryEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return objectSummaryRepository.findAll(searchObject(filter),pageable);
    }

    @Override
    public List<ObjectSummaryEntity> findByActiveTrue() {
        return objectSummaryRepository.findByActiveTrue();
    }


    @Override
    public List<ObjectSummaryEntity> findOutside5mAndDetectingFalseAndActiveFalse(double latitude, double longitude, double distanceInMeters) {
        List<ObjectSummaryEntity> summaries = objectSummaryRepository.findAllActiveSummaries();

        // 5미터 반경 밖의 Detecting = false 및 Active = false인 ObjectSummaryEntity 리스트를 필터링
        return summaries.stream()
                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) < distanceInMeters
                        && !summary.getDetecting() && !summary.getActive())
                .collect(Collectors.toList());
    }

    @Override
    public List<ObjectSummaryEntity> findOutside5mAndDetecting(double latitude, double longitude, double distanceInMeters) {
        List<ObjectSummaryEntity> summaries = objectSummaryRepository.findAllActiveSummaries();

        return summaries.stream()
                .filter(summary -> objectEntityService.calculateDistance(latitude, longitude, summary.getLastLat(), summary.getLastLng()) > distanceInMeters)  // Detecting = false
                .collect(Collectors.toList());
    }

    @Override
    public List<ObjectSummaryWithLatestObjectDto> findActiveSummariesWithLastObjectAndImage() {

        List<ObjectSummaryWithLatestObjectProjection> summaries = objectSummaryRepository.findActiveSummaries();
        List<ObjectSummaryWithLatestObjectDto> result = new ArrayList<>();
        for (ObjectSummaryWithLatestObjectProjection summary : summaries) {

            ObjectEntity object = objectEntityRepository.findTopByObjectSummaryEntityIdOrderBySeqDesc(summary.getId());
            object.setObjectImageEntity(objectImageEntityRepository.findTopByObjectSeqOrderBySeqDesc(object.getSeq()));
            ObjectSummaryWithLatestObjectDto dto = new ObjectSummaryWithLatestObjectDto(summary, object);
            result.add(dto);
        }
        return result;
    }


    public Specification<ObjectSummaryEntity> searchObject(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "seq":
                        Predicate seqPredicate = cb.equal(root.get("seq").as(Long.class), value);
                        predicates.add(seqPredicate);
                        break;
                    case "objectType":
                        Predicate objectTypePredicate = cb.equal(root.get("objectType").as(String.class), value);
                        predicates.add(objectTypePredicate);
                        break;
                    case "lastLat":
                        Predicate latPredicate = cb.equal(root.get("lastLat").as(Double.class), value);
                        predicates.add(latPredicate);
                        break;
                    case "lastLng":
                        Predicate lngPredicate = cb.equal(root.get("lastLng").as(Double.class), value);
                        predicates.add(lngPredicate);
                        break;
                    case "totalCount":
                        Predicate totalCountPredicate = cb.equal(root.get("totalCount").as(Integer.class), value);
                        predicates.add(totalCountPredicate);
                        break;
                    case "active":
                        Predicate activePredicate = cb.equal(root.get("active").as(Boolean.class), value);
                        predicates.add(activePredicate);
                        break;
                    case "detecting":
                        Predicate detectingPredicate = cb.equal(root.get("detecting").as(Boolean.class), value);
                        predicates.add(detectingPredicate);
                        break;

                    case "startDate":
                        Predicate startDatePredicate = cb.greaterThanOrEqualTo(root.get("updated"), DateUtil.stringToLocalDateTimeStart(value));
                        predicates.add(startDatePredicate);
                        break;
                    case "endDate":
                        Predicate endDatePredicate = cb.lessThanOrEqualTo(root.get("updated"), DateUtil.stringToLocalDateTimeEndOfDay(value));
                        predicates.add(endDatePredicate);
                        break;
                }
            });
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
