package com.obigo.v2x.repo;

import com.obigo.v2x.entity.ObjectEntity;
import com.obigo.v2x.entity.ObjectImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjectImageEntityRepository extends JpaRepository<ObjectImageEntity, Long>, JpaSpecificationExecutor<ObjectImageEntity> {


    ObjectImageEntity findTopByObjectSeqOrderBySeqDesc(Long objectSeq);


    
}
