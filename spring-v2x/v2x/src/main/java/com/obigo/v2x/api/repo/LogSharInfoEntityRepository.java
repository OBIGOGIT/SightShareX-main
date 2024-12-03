package com.obigo.v2x.api.repo;

import com.obigo.v2x.api.entity.LogSharInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LogSharInfoEntityRepository extends JpaRepository<LogSharInfoEntity, Long>, JpaSpecificationExecutor<LogSharInfoEntity> {


}
