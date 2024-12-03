package com.obigo.v2x.repo;

import com.obigo.v2x.entity.SharInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SharInfoRepository extends JpaRepository<SharInfo, Long>, JpaSpecificationExecutor<SharInfo> {
}
