package com.obigo.v2x.mqtt.repo;

import com.obigo.v2x.mqtt.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<TopicEntity, Long> {

    List<TopicEntity> findByUseYn(Boolean useYn);

}
