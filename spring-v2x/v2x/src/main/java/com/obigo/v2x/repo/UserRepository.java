package com.obigo.v2x.repo;

import com.obigo.v2x.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    User findByUserSeq(Long userSeq);
    User findByEmail(String email);
    User findByUserId(String id);
}
