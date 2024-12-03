package com.obigo.v2x.repo;

import com.obigo.v2x.entity.ObjectEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ObjectEntityRepository extends JpaRepository<ObjectEntity, Long>, JpaSpecificationExecutor<ObjectEntity> {

    Optional<ObjectEntity> findById(Long id);

    ObjectEntity findByLatAndLng(Double lat, Double lng);

    // JPQL 쿼리 정의
    @Query("SELECT e FROM ObjectEntity e WHERE e.lat BETWEEN :minLat AND :maxLat AND e.lng BETWEEN :minLng AND :maxLng")
    List<ObjectEntity> findNearbyActiveLocations(@Param("minLat") double minLat,
                                                 @Param("maxLat") double maxLat,
                                                 @Param("minLng") double minLng,
                                                 @Param("maxLng") double maxLng);

    @Query(value = "SELECT * FROM object_m oe WHERE oe.summary_id = :summaryId AND oe.seq IN (SELECT i.seq FROM object_image_path_m i WHERE i.seq = oe.seq) ORDER BY oe.seq DESC LIMIT 1", nativeQuery = true)
    ObjectEntity findLatestObjectEntityBySummaryId(@Param("summaryId") Long summaryId);

    ObjectEntity findTopByObjectSummaryEntityIdOrderBySeqDesc(Long summaryId);

}

