package com.capgemini.organizeIT.infrastructure.permission.repositories;

import com.capgemini.organizeIT.infrastructure.permission.entities.Permission;
import com.capgemini.organizeIT.infrastructure.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Set<Permission> findByHolder_Email(String email);
    void deleteAllByHolder(User holder);
}
