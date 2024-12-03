package com.obigo.v2x.repo;

import com.obigo.v2x.entity.SharInfo;
import com.obigo.v2x.entity.SharInfoObstacles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SharInfoObstaclesRepository extends JpaRepository<SharInfoObstacles, Long>, JpaSpecificationExecutor<SharInfoObstacles> {
}
