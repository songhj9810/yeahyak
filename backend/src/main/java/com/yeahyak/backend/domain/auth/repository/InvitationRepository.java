package com.yeahyak.backend.domain.auth.repository;

import com.yeahyak.backend.domain.auth.entity.Invitation;
import com.yeahyak.backend.domain.auth.entity.InvitationStatus;
import com.yeahyak.backend.domain.user.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByToken(String token);

    @Query(value = """
            SELECT i FROM Invitation i
            JOIN FETCH i.admin
            WHERE (:role IS NULL OR i.role = :role)
              AND (:status IS NULL OR i.status = :status)
            """,
            countQuery = """
                    SELECT COUNT(i) FROM Invitation i
                    WHERE (:role IS NULL OR i.role = :role)
                      AND (:status IS NULL OR i.status = :status)
                    """)
    Page<Invitation> searchInvitations(@Param("role") UserRole role,
                                       @Param("status") InvitationStatus status,
                                       Pageable pageable);
}
