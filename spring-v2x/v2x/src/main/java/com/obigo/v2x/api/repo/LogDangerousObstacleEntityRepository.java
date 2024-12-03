package com.obigo.v2x.api.repo;

import com.obigo.v2x.api.entity.LogDangerousObstacleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LogDangerousObstacleEntityRepository extends JpaRepository<LogDangerousObstacleEntity, Long>, JpaSpecificationExecutor<LogDangerousObstacleEntity> {


}
