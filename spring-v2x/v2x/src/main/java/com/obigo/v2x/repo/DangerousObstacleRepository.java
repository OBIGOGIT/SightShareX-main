package com.obigo.v2x.repo;

import com.obigo.v2x.entity.DangerousObstacle;
import com.obigo.v2x.entity.SharInfoPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DangerousObstacleRepository extends JpaRepository<DangerousObstacle, Long>, JpaSpecificationExecutor<DangerousObstacle> {
}
