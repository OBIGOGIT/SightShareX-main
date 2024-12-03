package com.obigo.v2x.repo;

import com.obigo.v2x.entity.SharInfoImage;
import com.obigo.v2x.entity.SharInfoPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SharInfoImageRepository extends JpaRepository<SharInfoImage, Long>, JpaSpecificationExecutor<SharInfoImage> {
}
