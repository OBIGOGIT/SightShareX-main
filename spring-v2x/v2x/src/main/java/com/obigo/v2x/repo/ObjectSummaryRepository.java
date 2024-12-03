package com.obigo.v2x.repo;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObjectSummaryEntity;
import com.obigo.v2x.entity.ObjectSummaryWithLatestObjectProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ObjectSummaryRepository extends JpaRepository<ObjectSummaryEntity, Long>, JpaSpecificationExecutor<ObjectSummaryEntity> {

    @Query("SELECT s FROM ObjectSummaryEntity s WHERE s.objectType = :objectType AND s.active = true")
    List<ObjectSummaryEntity> findByObjectTypeAndActiveTrue(@Param("objectType") String objectType);

    @Query("SELECT s FROM ObjectSummaryEntity s WHERE s.active = true")
    List<ObjectSummaryEntity> findAllActiveSummaries();

    List<ObjectSummaryEntity> findByActiveTrue();

    @Query(value = "SELECT os.*, oe.* " +
            "FROM object_summary_m os " +
            "LEFT JOIN LATERAL ( " +
            "    SELECT oe.* " +
            "    FROM object_m oe " +
            "    WHERE oe.summary_id = os.id " +
            "    ORDER BY oe.seq DESC " +  // 최신의 ObjectEntity
            "    LIMIT 1 " +  // 최신 1개만 가져옴
            ") oe ON true " +
            "WHERE os.active = true",  // 활성화된 ObjectSummaryEntity만 가져옴
            nativeQuery = true)
    List<ObjectSummaryEntity> findActiveSummariesWithLastObjectAndImage();


    @Query("SELECT os.id AS id, os.objectType AS objectType, os.totalCount AS totalCount, " +
            "os.active AS active, os.detecting AS detecting, os.lastLat AS lastLat, os.lastLng AS lastLng " +
            "FROM ObjectSummaryEntity os WHERE os.active = true")
    List<ObjectSummaryWithLatestObjectProjection> findActiveSummaries();

}
