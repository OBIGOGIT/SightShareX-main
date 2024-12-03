package com.obigo.v2x.repo;

import com.obigo.v2x.entity.ObuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObuEntityRepository extends JpaRepository<ObuEntity, Long>, JpaSpecificationExecutor<ObuEntity> {


    List<ObuEntity> findTop50ByOrderBySeqDesc();

    @Query(value = "SELECT * FROM (" +
            "SELECT *, ROW_NUMBER() OVER(PARTITION BY oub_id ORDER BY seq DESC) AS rn " +
            "FROM obu_m " +
            ") AS temp " +
            "WHERE temp.rn <= 50", nativeQuery = true)
    List<ObuEntity> findTop50ByOubId();
}
