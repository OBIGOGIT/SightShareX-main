package com.obigo.v2x.service.impl;

import com.obigo.v2x.entity.ApiKeyEntity;
import com.obigo.v2x.entity.User;
import com.obigo.v2x.repo.ApiKeyRepository;
import com.obigo.v2x.service.ApiKeyService;
import com.obigo.v2x.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiKeyServiceImpl implements ApiKeyService {


    private final ApiKeyRepository apiKeyRepository;

    @Override
    public List<ApiKeyEntity> findAll() {
        return apiKeyRepository.findAll();
    }

    @Override
    public Page<ApiKeyEntity> findAll(Map<String, Object> filter, Pageable pageable) {
        return apiKeyRepository.findAll(searchApiKey(filter), pageable);
    }

    @Override
    public ApiKeyEntity getApikeyEntity(Long apiKeySeq) {
        return apiKeyRepository.findByApiKeySeq(apiKeySeq);
    }

    @Override
    public ApiKeyEntity getApiKeyEntity(String apiKey) {
        return apiKeyRepository.findByApiKey(apiKey);
    }

    @Override
    public ApiKeyEntity update(ApiKeyEntity apikeyEntity) {
        return apiKeyRepository.save(apikeyEntity);
    }

    @Override
    public void deleteApiKeyEntity(ApiKeyEntity apikeyEntity) {
        apiKeyRepository.delete(apikeyEntity);
    }

    @Override
    public ApiKeyEntity getApiKey(User user) {
        return apiKeyRepository.findByUser(user);
    }


    public Specification<ApiKeyEntity> searchApiKey(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
//            query.orderBy(cb.desc(root.get("created")));
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "apiKeySeq":
                        Predicate apiKeySeqPredicate = cb.equal(root.get("apiKeySeq").as(Long.class), value);
                        predicates.add(apiKeySeqPredicate);
                        break;
                    case "apiKey":
                        Predicate apiKeyPredicate = cb.like(root.get("apiKey").as(String.class), likeValue);
                        predicates.add(apiKeyPredicate);
                        break;
                    case "useYn":
                        Predicate useYnPredicate = cb.equal(root.get("useYn").as(Boolean.class), value);
                        predicates.add(useYnPredicate);
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
