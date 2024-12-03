package com.obigo.v2x.repo;

import com.obigo.v2x.entity.ApiKeyEntity;
import com.obigo.v2x.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKeyEntity, Long>, JpaSpecificationExecutor<ApiKeyEntity> {

    ApiKeyEntity findByApiKeySeq(Long policySeq);
    ApiKeyEntity findByApiKey(String policyName);

    ApiKeyEntity findByUser(User user);

}
