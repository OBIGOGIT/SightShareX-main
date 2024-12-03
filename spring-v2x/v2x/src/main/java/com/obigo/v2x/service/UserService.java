package com.obigo.v2x.service;

import com.obigo.v2x.entity.User;
import com.obigo.v2x.entity.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface UserService {

    User getUser(long id);

    User getUser(String userId);

    UserDto findUser(User user);

    User findByUserSeq(Long userSeq);

    User update(UserDto userDto);

    User updateMyInfo(UserDto userDto);

    Page<User> findAll(Map<String, Object> filter, Pageable pageable);

    User createUser(UserDto userDto);
    void deleteUser(User user);

    void deleteMyInfo(User user);

}
