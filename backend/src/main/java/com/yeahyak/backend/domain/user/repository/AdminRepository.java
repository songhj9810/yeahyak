package com.yeahyak.backend.domain.user.repository;

import com.yeahyak.backend.domain.user.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByEmployeeId(String employeeId);

    Optional<Admin> findByUserId(Long userId);

    @Query("""
            SELECT a FROM Admin a
            JOIN FETCH a.user
            WHERE a.user.id = :userId
            """)
    Optional<Admin> findByUserIdWithUser(@Param("userId") Long userId);
}
