package com.obigo.v2x.service;

import com.obigo.v2x.entity.ApiKeyEntity;
import com.obigo.v2x.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ApiKeyService {

    List<ApiKeyEntity> findAll();
    Page<ApiKeyEntity> findAll(Map<String, Object> filter, Pageable pageable);

    ApiKeyEntity getApikeyEntity(Long apiKeySeq);
    ApiKeyEntity getApiKeyEntity(String apiKey);

    ApiKeyEntity update(ApiKeyEntity apikeyEntity);

    void deleteApiKeyEntity(ApiKeyEntity apikeyEntity);

    ApiKeyEntity getApiKey(User user);


}
