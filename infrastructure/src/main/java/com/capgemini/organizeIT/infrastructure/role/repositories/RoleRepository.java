package com.capgemini.organizeIT.infrastructure.role.repositories;

import com.capgemini.organizeIT.infrastructure.role.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
