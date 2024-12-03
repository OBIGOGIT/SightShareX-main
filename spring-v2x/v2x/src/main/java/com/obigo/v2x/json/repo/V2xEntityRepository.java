package com.obigo.v2x.json.repo;

import com.obigo.v2x.json.entity.V2xEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface V2xEntityRepository extends JpaRepository<V2xEntity, Long>, JpaSpecificationExecutor<V2xEntity> {

}
