package com.obigo.v2x.service.impl;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.repo.ObjectEntityRepository;
import com.obigo.v2x.service.ObjectEntityService;
import com.obigo.v2x.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.*;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ObjectEntityServiceImpl implements ObjectEntityService {

    private final ObjectEntityRepository objectEntityRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private static final double EARTH_RADIUS = 6371e3;

    private BlockingQueue<ObjectEntity> objectQueue = new ArrayBlockingQueue<>(1);

    private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);


    @Override
    public Optional<ObjectEntity> findById(Long seq) {
        return objectEntityRepository.findById(seq);
    }

    @Override
    public Page<ObjectEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return objectEntityRepository.findAll(searchObject(filter),pageable);
    }

    @Override
    public List<ObjectEntity> findAll(Sort sort) {
        return objectEntityRepository.findAll(sort);
    }

    @Override
    public Page<ObjectEntity> findAll(Pageable pageable) {
        return objectEntityRepository.findAll(pageable);
    }

    @Override
    public ObjectEntity findByLatAndLng(ObjectEntity objectEntity) {
        return objectEntityRepository.findByLatAndLng(objectEntity.getLat(), objectEntity.getLng());
    }

    @Override
    public ObjectEntity update(ObjectEntity objectEntity) {

        return objectEntityRepository.save(objectEntity);
    }

    @Override
    public ObjectEntity merge(ObjectEntity objectEntity) {
        return entityManager.merge(objectEntity);
    }

    @Override
    public List<ObjectEntity> findAll() {
        return objectEntityRepository.findAll();
    }

    @Override
    public void removeToQueue() {

        if (objectQueue.remainingCapacity() == 0) {  // 큐가 꽉 찬 경우
            objectQueue.poll();  // 기존 메시지를 제거
        }
    }

    @Override
    public void addLocationDataToQueue(ObjectEntity objectEntity) {

        for (ObjectEntity existingEntity : objectQueue) {
            if (calculateDistance(objectEntity.getLat(), objectEntity.getLng(),
                    existingEntity.getLat(), existingEntity.getLng()) < 10) {
                return; // 10미터 이내면 추가하지 않고 종료
            }
        }
        if (objectQueue.remainingCapacity() == 0) {  // 큐가 꽉 찬 경우
            objectQueue.poll();  // 기존 메시지를 제거
        }
        objectQueue.add(objectEntity);
        // 1초 후에 해당 데이터를 큐에서 제거하는 작업 예약
//        scheduler.schedule(() -> {
//            if (objectQueue.contains(objectEntity)) {
//                objectEntityRepository.delete(objectEntity);
//                objectQueue.remove(objectEntity);
//            }
//        }, 5, TimeUnit.SECONDS); // 1초 후에 실행
    }

    @Override
    public ObjectEntity getNextLocationData() {
        ObjectEntity entity = objectQueue.poll();
        return entity;
    }

    @Override
    public ObjectEntity getPeekLocationData() {
        ObjectEntity entity = objectQueue.peek();
        return entity;
    }

    @Override
    public boolean isQueueEmpty() {
        return objectQueue.isEmpty();
    }

    @Override
    public ObjectEntity findLatestObjectEntityBySummaryId(Long summaryId) {

        return objectEntityRepository.findTopByObjectSummaryEntityIdOrderBySeqDesc(summaryId);
    }

    @Override
    public void updateActiveStatusForNearbyLocations(double latitude, double longitude) {
        double latRange = 0.000045;  // 대략 5m 정도의 위도 차이
        double lngRange = 0.000045;  // 대략 5m 정도의 경도 차이
        List<ObjectEntity> nearbyLocations = objectEntityRepository.findNearbyActiveLocations(latitude, longitude, latRange, lngRange);
        for (ObjectEntity entity : nearbyLocations) {
            double distance = calculateDistance(latitude, longitude, entity.getLat(), entity.getLng());
            if (distance <= 5) {
                objectEntityRepository.save(entity);  // 업데이트 후 저장
                log.info("반경 5m 내 위치의 active 값을 false로 변경: {}", entity);
            }
        }
    }


    @Override
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;  // 미터 단위의 거리 반환
    }


    public Specification<ObjectEntity> searchObject(Map<String, Object> filter) {
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
                        Predicate startDatePredicate = cb.greaterThanOrEqualTo(root.get("created"), DateUtil.stringToLocalDate(value));
                        predicates.add(startDatePredicate);
                        break;
                    case "endDate":
                        Predicate endDatePredicate = cb.lessThanOrEqualTo(root.get("created"), DateUtil.stringToLocalDate(value));
                        predicates.add(endDatePredicate);
                        break;
                }
            });
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

