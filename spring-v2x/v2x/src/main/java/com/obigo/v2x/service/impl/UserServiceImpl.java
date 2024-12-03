package com.obigo.v2x.service.impl;

import com.obigo.v2x.common.ErrorMessage;
import com.obigo.v2x.entity.User;
import com.obigo.v2x.entity.UserDto;
import com.obigo.v2x.repo.UserRepository;
import com.obigo.v2x.service.CustomAuthenticationProvider;
import com.obigo.v2x.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {


    private final CustomAuthenticationProvider customAuthenticationProvider;

    private final UserRepository userRepository;


    @Override
    public User getUser(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found user with id =" + id));
    }

    @Override
    public User getUser(String userId) {
        return userRepository.findByUserId(userId);
    }

    @Override
    public UserDto findUser(User user) {
        return new UserDto(userRepository.findByUserSeq(user.getUserSeq()));
    }

    @Override
    public User findByUserSeq(Long userSeq) {
        return userRepository.findByUserSeq(userSeq);
    }

    @Override
    public User update(UserDto userDto) {
        User user = userRepository.findByUserSeq(userDto.getUserSeq());
        user.setIsActive(userDto.getIsActive());
        user.setFailCount(userDto.getFailCount());
        user.setName(userDto.getName());
        return userRepository.save(user);
    }

    @Override
    public User updateMyInfo(UserDto userDto) {
        User user = userRepository.findByUserSeq(userDto.getUserSeq());
        if(userDto.getPassword() != null && userDto.getRePassword() != null) {
            if(!userDto.getPassword().equals(userDto.getRePassword())) {
                throw new BadCredentialsException(ErrorMessage.CURRENT_PASSWORD_DO_NOT_MATCH.getMessage());
            }
            if(userDto.getPassword() != null) {
                user.setPassword(customAuthenticationProvider.passwordEncoder().encode(userDto.getPassword()));
            }
        }
        return userRepository.save(user);
    }

    @Override
    public Page<User> findAll(Map<String, Object> filter, Pageable pageable) {
        return userRepository.findAll(searchUser(filter), pageable);
    }

    @Override
    public User createUser(UserDto userDto) {

        if(userRepository.findByUserId(userDto.getUserId()) != null){
            throw new BadCredentialsException(ErrorMessage.ID_ALREADY_EXISTS.getMessage());
        }
        if(userRepository.findByEmail(userDto.getEmail()) != null) {
            throw new BadCredentialsException(ErrorMessage.EMAIL_ALREADY_EXISTS.getMessage());
        }
        if(userDto.getName() == null) {
            throw new BadCredentialsException(ErrorMessage.NAME_REQUIRED.getMessage());
        }
        if(userDto.getPassword() != null && !userDto.getPassword().equals(userDto.getRePassword())) {
            throw new BadCredentialsException(ErrorMessage.CURRENT_PASSWORD_DO_NOT_MATCH.getMessage());
        }
        User user = User.builder()
                .userId(userDto.getUserId())
                .email(userDto.getEmail())
                .name(userDto.getName())
                .isActive(userDto.getIsActive())
                .failCount(userDto.getFailCount())
                .role(userDto.getRole())
                .type(userDto.getType())
                .build();
        if (userDto.getPassword() != null) {
            user.setPassword(customAuthenticationProvider.passwordEncoder().encode(userDto.getPassword()));
        }
        if (userDto.getRole() == null) {
            user.setRole("ROLE_USER");
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(User user) {

        User findUser = userRepository.findByUserSeq(user.getUserSeq());
        if(findUser == null) {
            throw new BadCredentialsException(ErrorMessage.AUTHENTICATION_MEMBER_NOT_EXISTS.getMessage());
        }
        userRepository.delete(findUser);
    }

    @Transactional
    @Override
    public void deleteMyInfo(User user) {
        user.setIsActive(false);
        Map<String,Object> filter = new HashMap<>();
        filter.put("userSeq",user.getUserSeq());
        userRepository.save(user);
    }


    public Specification<User> searchUser(Map<String, Object> filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
//            query.orderBy(cb.desc(root.get("created")));
            filter.forEach((key, value) -> {
                String likeValue = "%" + value + "%";
                switch (key) {
                    case "email":
                        Predicate emailPredicate = cb.like(root.get("email").as(String.class), likeValue);
                        predicates.add(emailPredicate);
                        break;
                    case "userId":
                        Predicate phonePredicate = cb.like(root.get("userId").as(String.class), likeValue);
                        predicates.add(phonePredicate);
                        break;
                    case "sex":
                        Predicate sexPredicate = cb.equal(root.get("sex").as(String.class), value);
                        predicates.add(sexPredicate);
                        break;
                    case "name":
                        Predicate nameDatePredicate = cb.like(root.get("name").as(String.class), likeValue);
                        predicates.add(nameDatePredicate);
                        break;
                    case "isActive":
                        Predicate isActivePredicate = cb.equal(root.get("isActive").as(Boolean.class), value);
                        predicates.add(isActivePredicate);
                        break;
                }
            });
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
